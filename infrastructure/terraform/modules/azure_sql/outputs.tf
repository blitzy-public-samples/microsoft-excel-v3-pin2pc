value       = azurerm_sql_server.main.fully_qualified_domain_name
  description = "The fully qualified domain name of the Azure SQL Server"
}

output "sql_database_name" {
  value       = azurerm_sql_database.main.name
  description = "The name of the Azure SQL Database"
}

output "sql_connection_string" {
  value       = "Server=tcp:${azurerm_sql_server.main.fully_qualified_domain_name},1433;Initial Catalog=${azurerm_sql_database.main.name};Persist Security Info=False;User ID=${var.admin_username};Password=${var.admin_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  description = "Connection string for the Azure SQL Database"
  sensitive   = true
}

output "resource_group_name" {
  value       = azurerm_resource_group.main.name
  description = "The name of the resource group in which the Azure SQL resources are created"
}

output "sql_server_name" {
  value       = azurerm_sql_server.main.name
  description = "The name of the Azure SQL Server"
}

# Human tasks:
# TODO: Review the sensitive output 'sql_connection_string' and ensure it's only used in secure contexts
# TODO: Consider adding more granular outputs if needed for specific use cases in the Excel application infrastructure