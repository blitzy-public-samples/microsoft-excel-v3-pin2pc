# Azure CDN Module Outputs

output "cdn_profile_id" {
  description = "The ID of the Azure CDN Profile"
  value       = azurerm_cdn_profile.main.id
}

output "cdn_profile_name" {
  description = "The name of the Azure CDN Profile"
  value       = azurerm_cdn_profile.main.name
}

output "cdn_endpoint_id" {
  description = "The ID of the Azure CDN Endpoint"
  value       = azurerm_cdn_endpoint.main.id
}

output "cdn_endpoint_name" {
  description = "The name of the Azure CDN Endpoint"
  value       = azurerm_cdn_endpoint.main.name
}

output "cdn_endpoint_fqdn" {
  description = "The fully qualified domain name of the Azure CDN Endpoint"
  value       = azurerm_cdn_endpoint.main.fqdn
}

output "cdn_endpoint_origin_host_header" {
  description = "The host header the CDN provider will send along with content requests to origins"
  value       = azurerm_cdn_endpoint.main.origin_host_header
}