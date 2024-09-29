# Environment name
environment = "dev"

# Azure region for resource deployment
location = "eastus"

# Backend configuration for storing Terraform state
backend_resource_group_name = "rg-excel-tfstate"
backend_storage_account_name = "saexceltfstatedev"
backend_container_name = "tfstate"

# Database configuration
sql_admin_username = "sqladmin"
sql_admin_password = "TO_BE_REPLACED_WITH_SECURE_PASSWORD"

# App Service Plan configuration
app_service_plan_sku = {
  tier = "Standard"
  size = "S1"
}

# Cosmos DB configuration
cosmos_db_consistency_level = "Session"

# Storage account configuration
storage_account_tier = "Standard"
storage_account_replication_type = "LRS"

# TODO: Human tasks
# 1. Replace 'TO_BE_REPLACED_WITH_SECURE_PASSWORD' with a secure password for SQL admin, preferably using Azure Key Vault or another secure secret management solution
# 2. Review and adjust resource SKUs and tiers to ensure they meet development environment requirements while optimizing costs
# 3. Verify that the 'location' value is appropriate for the development environment
# 4. Ensure that the backend storage account and container names are unique and available
# 5. Consider implementing a naming convention for resources that clearly distinguishes between environments