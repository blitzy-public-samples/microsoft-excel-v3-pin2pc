variable "project_name" {
  type        = string
  description = "The name of the project, used as a prefix for resource naming"
  default     = "excel-cloud"
}

variable "environment" {
  type        = string
  description = "The deployment environment (e.g., dev, staging, prod)"
  default     = "dev"
}

variable "location" {
  type        = string
  description = "The Azure region where resources will be deployed"
  default     = "eastus"
}

variable "azure_sql_sku" {
  type        = string
  description = "The SKU for Azure SQL Database"
  default     = "S0"
}

variable "cosmos_db_throughput" {
  type        = number
  description = "The provisioned throughput for Cosmos DB"
  default     = 400
}

variable "blob_storage_tier" {
  type        = string
  description = "The access tier for Azure Blob Storage"
  default     = "Hot"
}

variable "app_service_sku" {
  type        = string
  description = "The SKU for Azure App Service"
  default     = "P1v2"
}

variable "min_tls_version" {
  type        = string
  description = "The minimum TLS version required for SSL/TLS connections"
  default     = "1.2"
}

variable "allowed_ip_ranges" {
  type        = list(string)
  description = "List of IP ranges allowed to access the resources"
}

variable "tags" {
  type        = map(string)
  description = "A mapping of tags to assign to the resources"
}

# Additional variables for Excel project infrastructure

variable "function_app_sku" {
  type        = string
  description = "The SKU for Azure Functions App"
  default     = "EP1"
}

variable "cdn_sku" {
  type        = string
  description = "The SKU for Azure Content Delivery Network"
  default     = "Standard_Microsoft"
}

variable "log_retention_days" {
  type        = number
  description = "The number of days to retain logs"
  default     = 30
}

variable "enable_monitoring" {
  type        = bool
  description = "Enable Azure Monitor and Log Analytics"
  default     = true
}

variable "enable_backup" {
  type        = bool
  description = "Enable automated backups for databases"
  default     = true
}

variable "backup_retention_days" {
  type        = number
  description = "The number of days to retain backups"
  default     = 7
}

# Sensitive variables (consider using Azure Key Vault for production)

variable "sql_admin_login" {
  type        = string
  description = "The admin username for Azure SQL Database"
  sensitive   = true
}

variable "sql_admin_password" {
  type        = string
  description = "The admin password for Azure SQL Database"
  sensitive   = true
}

variable "cosmos_db_key" {
  type        = string
  description = "The primary key for Cosmos DB"
  sensitive   = true
}

variable "storage_account_key" {
  type        = string
  description = "The access key for Azure Storage Account"
  sensitive   = true
}