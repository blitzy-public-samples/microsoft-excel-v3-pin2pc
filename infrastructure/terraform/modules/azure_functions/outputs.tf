# Azure Functions Module Outputs

output "function_app_name" {
  description = "The name of the Azure Function App"
  value       = azurerm_function_app.excel_function_app.name
}

output "function_app_default_hostname" {
  description = "The default hostname of the Azure Function App"
  value       = azurerm_function_app.excel_function_app.default_hostname
}

output "function_app_id" {
  description = "The ID of the Azure Function App"
  value       = azurerm_function_app.excel_function_app.id
}

output "function_app_identity" {
  description = "The managed service identity of the Azure Function App"
  value       = azurerm_function_app.excel_function_app.identity
}

# Human tasks:
# TODO: Verify that the output names and values align with the actual resources created in the main.tf file
# TODO: Ensure that these outputs provide sufficient information for other modules or the root module to interact with the Azure Functions
# TODO: Consider adding any additional outputs that might be necessary for monitoring, logging, or integration purposes