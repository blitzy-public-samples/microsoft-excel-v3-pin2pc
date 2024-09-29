resource_group_name = "rg-excel-staging"
location            = "East US"

# Azure SQL Database
sql_server_name     = "sqlserver-excel-staging"
sql_database_name   = "sqldb-excel-staging"
sql_admin_login     = "sqladmin"
sql_admin_password  = "Change_This_Password_123!" # Note: In practice, use a secret management solution

# Azure Cosmos DB
cosmos_db_account_name = "cosmosdb-excel-staging"
cosmos_db_throughput   = 400

# Azure Blob Storage
storage_account_name = "stexcelstaging"
container_name       = "excel-files"

# Azure App Service
app_service_plan_name = "asp-excel-staging"
app_service_name      = "app-excel-staging"
app_service_sku_tier  = "PremiumV2"
app_service_sku_size  = "P1v2"

# Azure Functions
function_app_name        = "func-excel-staging"
function_app_storage_name = "stfuncexcelstaging"

# Azure CDN
cdn_profile_name = "cdn-excel-staging"
cdn_endpoint_name = "cdnep-excel-staging"

# Application Settings
app_environment     = "staging"
enable_monitoring   = true
log_retention_days  = 30

# Scaling
min_capacity        = 2
max_capacity        = 10

# Networking
vnet_address_space  = ["10.1.0.0/16"]
subnet_prefixes     = ["10.1.1.0/24", "10.1.2.0/24", "10.1.3.0/24"]
subnet_names        = ["app-subnet", "function-subnet", "data-subnet"]

# Tags
default_tags = {
  Environment = "Staging"
  Project     = "Microsoft Excel"
  Department  = "Engineering"
  ManagedBy   = "Terraform"
}