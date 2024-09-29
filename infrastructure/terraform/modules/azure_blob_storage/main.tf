# Create a resource group for Azure Blob Storage
resource "azurerm_resource_group" "blob_storage" {
  name     = "rg-excel-blob-storage-${var.environment}"
  location = var.location

  tags = {
    environment = var.environment
    project     = "Microsoft Excel"
  }
}

# Create an Azure Storage Account for Blob Storage
resource "azurerm_storage_account" "excel_storage" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.blob_storage.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "GRS"
  account_kind             = "StorageV2"
  enable_https_traffic_only = true
  min_tls_version           = "TLS1_2"

  blob_properties {
    versioning_enabled = true
    delete_retention_policy {
      days = 30
    }
  }

  network_rules {
    default_action             = "Deny"
    ip_rules                   = var.allowed_ip_ranges
    virtual_network_subnet_ids = [var.subnet_id]
  }

  tags = {
    environment = var.environment
    project     = "Microsoft Excel"
  }
}

# Create a container for storing Excel workbooks
resource "azurerm_storage_container" "workbooks" {
  name                  = "workbooks"
  storage_account_name  = azurerm_storage_account.excel_storage.name
  container_access_type = "private"
}

# Create a container for storing Excel attachments
resource "azurerm_storage_container" "attachments" {
  name                  = "attachments"
  storage_account_name  = azurerm_storage_account.excel_storage.name
  container_access_type = "private"
}

# Create a lifecycle management policy for the storage account
resource "azurerm_storage_management_policy" "lifecycle_policy" {
  storage_account_id = azurerm_storage_account.excel_storage.id

  rule {
    name    = "move-to-cool-tier"
    enabled = true
    filters {
      prefix_match = ["workbooks/", "attachments/"]
      blob_types   = ["blockBlob"]
    }
    actions {
      base_blob {
        tier_to_cool_after_days_since_modification_greater_than = 30
      }
    }
  }

  rule {
    name    = "move-to-archive-tier"
    enabled = true
    filters {
      prefix_match = ["workbooks/", "attachments/"]
      blob_types   = ["blockBlob"]
    }
    actions {
      base_blob {
        tier_to_archive_after_days_since_modification_greater_than = 90
      }
    }
  }
}

# Outputs
output "storage_account_name" {
  value       = azurerm_storage_account.excel_storage.name
  description = "The name of the created Azure Storage Account"
}

output "primary_blob_endpoint" {
  value       = azurerm_storage_account.excel_storage.primary_blob_endpoint
  description = "The primary blob endpoint URL"
}

output "workbooks_container_name" {
  value       = azurerm_storage_container.workbooks.name
  description = "The name of the container for storing Excel workbooks"
}

output "attachments_container_name" {
  value       = azurerm_storage_container.attachments.name
  description = "The name of the container for storing Excel attachments"
}

# Human tasks (commented)
# TODO: Review and adjust the allowed IP ranges for production environment
# TODO: Confirm the subnet ID for the storage account network rules
# TODO: Verify compliance with data residency requirements for the chosen Azure region