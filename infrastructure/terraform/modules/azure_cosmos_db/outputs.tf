# Outputs for Azure Cosmos DB module

output "cosmos_db_account_id" {
  description = "The ID of the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.id
}

output "cosmos_db_account_endpoint" {
  description = "The endpoint used to connect to the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.endpoint
}

output "cosmos_db_account_primary_key" {
  description = "The primary key for the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.primary_key
  sensitive   = true
}

output "cosmos_db_account_connection_strings" {
  description = "A list of connection strings available for this Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.connection_strings
  sensitive   = true
}

output "cosmos_db_sql_database_id" {
  description = "The ID of the Cosmos DB SQL database"
  value       = azurerm_cosmosdb_sql_database.main.id
}

output "cosmos_db_sql_container_id" {
  description = "The ID of the Cosmos DB SQL container"
  value       = azurerm_cosmosdb_sql_container.main.id
}

# Human tasks (commented):
# TODO: Review the outputs to ensure all necessary information is exposed for other modules or for reference
# TODO: Verify that sensitive information like primary keys and connection strings are marked as sensitive
# TODO: Consider if any additional outputs are needed based on the specific requirements of the project