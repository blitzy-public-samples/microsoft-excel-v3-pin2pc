# Azure Region
azure_region = "eastus"

# Resource Group
resource_group_name = "rg-excel-prod"

# Azure SQL Database
azure_sql_server_name = "sql-excel-prod"
azure_sql_database_name = "sqldb-excel-prod"
azure_sql_sku_name = "S1"

# Azure Cosmos DB
azure_cosmos_db_account_name = "cosmosdb-excel-prod"
azure_cosmos_db_database_name = "exceldb-prod"
azure_cosmos_db_sku_name = "Standard"

# Azure Storage Account
azure_storage_account_name = "stexcelprod"
azure_storage_sku_name = "Standard_LRS"

# Azure App Service
azure_app_service_plan_name = "asp-excel-prod"
azure_app_service_name = "app-excel-prod"
azure_app_service_sku_name = "P2v2"

# Environment Tag
environment = "production"

# NOTE: Sensitive information like connection strings should be stored in Azure Key Vault and referenced here, not hardcoded.

# TODO: Review and adjust the SKU sizes based on expected production load
# TODO: Ensure all sensitive information (like connection strings) are stored in Azure Key Vault and referenced here, not hardcoded
# TODO: Validate the chosen Azure region aligns with data residency requirements