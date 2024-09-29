variable "resource_group_name" {
  type        = string
  description = "The name of the resource group in which to create the Azure SQL Database"
}

variable "location" {
  type        = string
  description = "The Azure region where the Azure SQL Database should be created"
}

variable "server_name" {
  type        = string
  description = "The name of the Azure SQL Database Server"
}

variable "database_name" {
  type        = string
  description = "The name of the Azure SQL Database"
}

variable "administrator_login" {
  type        = string
  description = "The administrator username for the Azure SQL Database Server"
}

variable "administrator_login_password" {
  type        = string
  description = "The administrator password for the Azure SQL Database Server"
  sensitive   = true
}

variable "sku_name" {
  type        = string
  description = "Specifies the SKU Name for this Azure SQL Database"
  default     = "S0"
}

variable "max_size_gb" {
  type        = number
  description = "The max size of the database in gigabytes"
  default     = 250
}

variable "zone_redundant" {
  type        = bool
  description = "Whether or not this database is zone redundant"
  default     = false
}

variable "geo_backup_enabled" {
  type        = bool
  description = "Whether or not geo-redundant backup is enabled"
  default     = true
}

variable "tags" {
  type        = map(string)
  description = "A mapping of tags to assign to the resource"
  default     = {}
}

# TODO: Review and adjust default values for variables based on specific project requirements
# TODO: Ensure that sensitive information like administrator_login_password is handled securely, preferably using Azure Key Vault or similar secret management solution
# TODO: Validate that the chosen SKU and database size align with the expected workload for Microsoft Excel's backend