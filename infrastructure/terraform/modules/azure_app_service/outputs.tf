# Output definitions for the Azure App Service module

output "app_service_name" {
  value       = azurerm_app_service.main.name
  description = "The name of the created Azure App Service"
}

output "app_service_default_hostname" {
  value       = azurerm_app_service.main.default_site_hostname
  description = "The default hostname of the created Azure App Service"
}

output "app_service_id" {
  value       = azurerm_app_service.main.id
  description = "The ID of the created Azure App Service"
}

output "app_service_plan_id" {
  value       = azurerm_app_service_plan.main.id
  description = "The ID of the App Service Plan"
}

output "resource_group_name" {
  value       = azurerm_resource_group.main.name
  description = "The name of the resource group containing the App Service"
}

# Human tasks:
# TODO: Review the outputs to ensure all necessary information is exposed for other modules or the root module to use
# TODO: Consider adding any additional outputs that might be useful for monitoring or management purposes