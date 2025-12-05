
terraform {
  backend "s3" {
    bucket = "playpal-state-bucket"
    endpoint = "https://sos-at-vie-1.exo.io"
    key      = "playpal/terraform.tfstate"
    region = "at-vie-1"
    skip_region_validation      = true
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_requesting_account_id  = true
  }
  required_providers {
    exoscale = {
      source  = "exoscale/exoscale"
      version = ">= 0.65.0"
    }
    kafka = {
      source  = "Mongey/kafka"
      version = "~> 0.13"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.38"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.16"
    }
  }
}

provider "exoscale" {
  # The API key and secret are expected to be set as
  # EXOSCALE_API_KEY and EXOSCALE_API_SECRET environment variables.
}

# SKS (Managed Kubernetes) Cluster
resource "exoscale_sks_cluster" "prod_cluster" {
  zone          = var.exoscale_zone
  name          = var.sks_cluster_name
  version       = var.sks_version
  exoscale_csi  = true
}

resource "exoscale_sks_kubeconfig" "prod_cluster_kubeconfig" {
  cluster_id = exoscale_sks_cluster.prod_cluster.id
  zone       = exoscale_sks_cluster.prod_cluster.zone

  user   = "kubernetes-admin"
  groups = ["system:masters"]
}

resource "local_sensitive_file" "kubeconfig" {
  filename = "./kubeconfig"
  content  = exoscale_sks_kubeconfig.prod_cluster_kubeconfig.kubeconfig
}

# Default Nodepool for the SKS Cluster
resource "exoscale_sks_nodepool" "prod_nodepool" {
  cluster_id   = exoscale_sks_cluster.prod_cluster.id
  zone         = exoscale_sks_cluster.prod_cluster.zone
  name         = "default-nodepool"
  instance_type = "standard.small" # General purpose, can be adjusted
  size         = 3                   # As requested, 3 nodes
}

# DBaaS Kafka Service
resource "exoscale_dbaas" "prod_kafka" {
  zone = var.exoscale_zone
  name = var.kafka_service_name
  type = "kafka"
  plan = var.kafka_plan
  
  kafka {
    # Specifying a recent Kafka version ensures Kraft is used instead of Zookeeper
    version = var.kafka_version
    enable_sasl_auth = true
    enable_cert_auth = false
    ip_filter = ["0.0.0.0/0"]
  }

  termination_protection = false
}

data "exoscale_database_uri" "prod_kafka" {
  
  name = var.kafka_service_name
  type = "kafka"
  zone = var.exoscale_zone

  depends_on = [ exoscale_dbaas.prod_kafka ]
}

resource "exoscale_dbaas_kafka_user" "prod_kafka_user" {
  service = var.kafka_service_name
  username = "prod_kafka_user"
  zone = var.exoscale_zone
}

provider "kafka" {
  bootstrap_servers = ["${data.exoscale_database_uri.prod_kafka.host}:21712"]
  sasl_mechanism    = "plain"
  sasl_username     = exoscale_dbaas_kafka_user.prod_kafka_user.username
  sasl_password     = exoscale_dbaas_kafka_user.prod_kafka_user.password
  tls_enabled       = true
  ca_cert           = exoscale_dbaas.prod_kafka.ca_certificate
}

resource "kafka_topic" "playpal_topic" {
  name               = "matches.matched"
  partitions         = 3
  replication_factor = 2

  depends_on = [
    # exoscale_dbaas_kafka_user.prod_kafka_user,
    exoscale_dbaas.prod_kafka
  ]
}

output "prod_kafka_service_uri" {
  value = data.exoscale_database_uri.prod_kafka.uri
  sensitive = true
}

provider "kubernetes" {
  host                   = yamldecode(exoscale_sks_kubeconfig.prod_cluster_kubeconfig.kubeconfig).clusters[0].cluster.server
  cluster_ca_certificate = base64decode(yamldecode(exoscale_sks_kubeconfig.prod_cluster_kubeconfig.kubeconfig).clusters[0].cluster.certificate-authority-data)
  client_certificate     = base64decode(yamldecode(exoscale_sks_kubeconfig.prod_cluster_kubeconfig.kubeconfig).users[0].user.client-certificate-data)
  client_key             = base64decode(yamldecode(exoscale_sks_kubeconfig.prod_cluster_kubeconfig.kubeconfig).users[0].user.client-key-data)
}

provider "helm" {
  kubernetes {
    host                   = yamldecode(exoscale_sks_kubeconfig.prod_cluster_kubeconfig.kubeconfig).clusters[0].cluster.server
    cluster_ca_certificate = base64decode(yamldecode(exoscale_sks_kubeconfig.prod_cluster_kubeconfig.kubeconfig).clusters[0].cluster.certificate-authority-data)
    client_certificate     = base64decode(yamldecode(exoscale_sks_kubeconfig.prod_cluster_kubeconfig.kubeconfig).users[0].user.client-certificate-data)
    client_key             = base64decode(yamldecode(exoscale_sks_kubeconfig.prod_cluster_kubeconfig.kubeconfig).users[0].user.client-key-data)
  }
}

resource "kubernetes_namespace" "playpal_ns" {
  metadata {
    name = "playpal"
  }
}

resource "helm_release" "mongodb" {
  name       = "mongodb"
  chart      = "./charts/mongodb"
  namespace  = kubernetes_namespace.playpal_ns.metadata[0].name

  set {
    name  = "auth.enabled"
    value = "true"
  }
  
  depends_on = [
    local_sensitive_file.kubeconfig,
    exoscale_sks_nodepool.prod_nodepool
  ]
}

# Resource to create the Kubernetes Secret in the target cluster
resource "kubernetes_secret" "kafka_prod_credentials" {
  metadata {
    name      = "kafka-prod-credentials"
    namespace = "playpal" # Or your desired namespace
  }

  type = "Opaque"

  data = {
    # Bootstrap URI (e.g., hostname:port)
    "KAFKA_BROKERS"        = "${data.exoscale_database_uri.prod_kafka.host}:21712"

    # SASL Username and Password
    "KAFKA_SASL_USERNAME"  = exoscale_dbaas_kafka_user.prod_kafka_user.username
    "KAFKA_SASL_PASSWORD"  = exoscale_dbaas_kafka_user.prod_kafka_user.password

    # CA Certificate (often used for mTLS client trust)
    "KAFKA_CA_CERTIFICATE" = exoscale_dbaas.prod_kafka.ca_certificate
  }
  
  # Ensure the Kafka service and its outputs are ready before creating the Secret
  depends_on = [
    exoscale_dbaas.prod_kafka,
    data.exoscale_database_uri.prod_kafka,
    kubernetes_namespace.playpal_ns
  ]
}