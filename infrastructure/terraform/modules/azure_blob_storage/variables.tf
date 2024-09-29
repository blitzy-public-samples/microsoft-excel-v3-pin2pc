variable "resource_group_name" {
  type        = string
  description = "The name of the resource group in which to create the storage account"
}

# Location
variable "location" {
  type        = string
  description = "The Azure Region in which to create the storage account"
}

# Storage Account
variable "storage_account_name" {
  type        = string
  description = "The name of the storage account"
}

# Account Tier
variable "account_tier" {
  type        = string
  description = "Defines the Tier to use for this storage account (Standard or Premium)"
  default     = "Standard"
}

# Account Replication Type
variable "account_replication_type" {
  type        = string
  description = "Defines the type of replication to use for this storage account (LRS, GRS, RAGRS, ZRS)"
  default     = "LRS"
}

# Access Tier
variable "access_tier" {
  type        = string
  description = "Defines the access tier for BlobStorage accounts (Hot or Cool)"
  default     = "Hot"
}

# HTTPS Traffic Only
variable "enable_https_traffic_only" {
  type        = bool
  description = "Boolean flag which forces HTTPS if enabled"
  default     = true
}

# Minimum TLS Version
variable "min_tls_version" {
  type        = string
  description = "The minimum supported TLS version for the storage account"
  default     = "TLS1_2"
}

# Allow Blob Public Access
variable "allow_blob_public_access" {
  type        = bool
  description = "Allow or disallow public access to all blobs or containers in the storage account"
  default     = false
}

# Containers
variable "containers" {
  type        = list(object({
    name        = string
    access_type = string
  }))
  description = "List of containers to create and their access levels"
  default     = []
}

# Tags
variable "tags" {
  type        = map(string)
  description = "A mapping of tags to assign to the resource"
  default     = {}
}

# The following tasks are pending for human review:
# TODO: Review and adjust default values for variables if necessary
# TODO: Add any additional variables specific to the project requirements