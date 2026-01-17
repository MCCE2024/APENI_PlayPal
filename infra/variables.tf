variable "exoscale_zone" {
  description = "The Exoscale zone to deploy resources in."
  type        = string
  default     = "at-vie-1"
}

variable "sks_cluster_name" {
  description = "The name of the SKS cluster."
  type        = string
  default     = "playpal-sks-cluster"
}

variable "sks_version" {
  description = "The Kubernetes version for the SKS cluster."
  type        = string
  default     = "1.35.0"
}

variable "kafka_service_name" {
  description = "The name of the DBaaS Kafka service."
  type        = string
  default     = "playpal-kafka-service"
}

variable "kafka_version" {
  description = "The version for the DBaaS Kafka service. Recent versions use Kraft."
  type        = string
  default     = "3.8"
}

variable "kafka_plan" {
  description = "The service plan on Exoscale for DBaaS Kafka."
  type        = string
  default     = "startup-2"
}

variable "exoscale_api_key" {
  description = "Exoscale API Key for CSI driver credentials"
  type        = string
  sensitive   = true
}

variable "exoscale_api_secret" {
  description = "Exoscale API Secret for CSI driver credentials"
  type        = string
  sensitive   = true
}

variable "resend_api_key" {
  description = "API Key for Resend email service"
  type        = string
  sensitive   = true
  default     = "" # Optional, so it doesn't break if not provided immediately
}

variable "cloudflare_api_token" {
  description = "API Token for Cloudflare (used by ExternalDNS)"
  type        = string
  sensitive   = true
  default     = ""
}
