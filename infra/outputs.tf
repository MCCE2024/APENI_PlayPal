output "sks_cluster_endpoint" {
  description = "The endpoint of the SKS cluster."
  value       = exoscale_sks_cluster.prod_cluster.endpoint
}

output "kubeconfig" {
  value     = exoscale_sks_kubeconfig.prod_cluster_kubeconfig.kubeconfig
  sensitive = true
}