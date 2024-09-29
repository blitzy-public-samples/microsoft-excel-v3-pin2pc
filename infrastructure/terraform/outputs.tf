# Terraform outputs file for the Microsoft Excel infrastructure

# Azure SQL Server output
output "azure_sql_server_name" {
  description = "The name of the Azure SQL Server instance"
  value       = module.azure_sql.server_name
}

# Azure SQL Database output
output "azure_sql_database_name" {
  description = "The name of the Azure SQL Database"
  value       = module.azure_sql.database_name
}

# Azure Cosmos DB output
output "cosmos_db_endpoint" {
  description = "The endpoint URL of the Azure Cosmos DB instance"
  value       = module.azure_cosmos_db.endpoint
}

output "cosmos_db_primary_key" {
  description = "The primary key for the Azure Cosmos DB instance"
  value       = module.azure_cosmos_db.primary_key
  sensitive   = true
}

# Azure Blob Storage output
output "blob_storage_account_name" {
  description = "The name of the Azure Blob Storage account"
  value       = module.azure_blob_storage.storage_account_name
}

output "blob_storage_primary_access_key" {
  description = "The primary access key for the Azure Blob Storage account"
  value       = module.azure_blob_storage.primary_access_key
  sensitive   = true
}

# Azure App Service output
output "app_service_name" {
  description = "The name of the Azure App Service instance"
  value       = module.azure_app_service.app_service_name
}

output "app_service_default_hostname" {
  description = "The default hostname of the Azure App Service instance"
  value       = module.azure_app_service.default_site_hostname
}

# Human tasks (commented)
# TODO: Review and confirm the output values to ensure they match the required infrastructure components for Microsoft Excel
# TODO: Ensure that sensitive outputs are properly marked and handled securely in the CI/CD pipeline