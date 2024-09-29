# Provider configuration
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 2.0"
    }
  }
}

# Resource: Azure Cosmos DB Account
resource "azurerm_cosmosdb_account" "cosmos_account" {
  name                = var.cosmos_db_account_name
  location            = var.location
  resource_group_name = var.resource_group_name
  offer_type          = var.offer_type
  kind                = var.kind

  enable_automatic_failover = true

  consistency_policy {
    consistency_level       = var.consistency_policy.consistency_level
    max_interval_in_seconds = var.consistency_policy.max_interval_in_seconds
    max_staleness_prefix    = var.consistency_policy.max_staleness_prefix
  }

  geo_location {
    location          = var.primary_geo_location.location
    failover_priority = var.primary_geo_location.failover_priority
  }

  dynamic "geo_location" {
    for_each = var.additional_geo_locations
    content {
      location          = geo_location.value.location
      failover_priority = geo_location.value.failover_priority
    }
  }

  dynamic "capabilities" {
    for_each = var.capabilities
    content {
      name = capabilities.value
    }
  }

  tags = var.tags
}

# Resource: Azure Cosmos DB SQL Database
resource "azurerm_cosmosdb_sql_database" "cosmos_sql_db" {
  name                = var.sql_database_name
  resource_group_name = var.resource_group_name
  account_name        = azurerm_cosmosdb_account.cosmos_account.name
  throughput          = var.sql_database_throughput
}

# Resource: Azure Cosmos DB SQL Container
resource "azurerm_cosmosdb_sql_container" "cosmos_sql_container" {
  name                = var.sql_container_name
  resource_group_name = var.resource_group_name
  account_name        = azurerm_cosmosdb_account.cosmos_account.name
  database_name       = azurerm_cosmosdb_sql_database.cosmos_sql_db.name
  partition_key_path  = var.partition_key_path
  throughput          = var.sql_container_throughput

  indexing_policy {
    indexing_mode = var.indexing_policy.indexing_mode

    dynamic "included_path" {
      for_each = var.indexing_policy.included_paths
      content {
        path = included_path.value
      }
    }

    dynamic "excluded_path" {
      for_each = var.indexing_policy.excluded_paths
      content {
        path = excluded_path.value
      }
    }
  }
}