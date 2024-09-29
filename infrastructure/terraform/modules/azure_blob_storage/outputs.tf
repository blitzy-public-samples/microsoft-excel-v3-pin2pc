output "storage_account_name" {
  description = "The name of the Azure Storage Account created for blob storage"
  value       = azurerm_storage_account.excel_storage.name
}

output "storage_account_primary_access_key" {
  description = "The primary access key for the Azure Storage Account"
  value       = azurerm_storage_account.excel_storage.primary_access_key
  sensitive   = true
}

output "storage_account_primary_connection_string" {
  description = "The primary connection string for the Azure Storage Account"
  value       = azurerm_storage_account.excel_storage.primary_connection_string
  sensitive   = true
}

output "blob_container_name" {
  description = "The name of the blob container created for storing Excel workbooks"
  value       = azurerm_storage_container.excel_workbooks.name
}

# Human tasks:
# TODO: Review and confirm the output values to ensure they match the resources created in the main.tf file of this module
# TODO: Ensure that sensitive outputs are marked as sensitive to prevent accidental exposure in logs