# which is used to deploy and configure the App Service that will host the Excel API and web application.

terraform {
  required_version = ">= 0.13.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 2.0"
    }
  }
}

variable "resource_group_name" {
  type        = string
  description = "The name of the resource group in which the App Service will be created"
}

variable "location" {
  type        = string
  description = "The Azure region where the App Service will be deployed"
}

variable "app_service_plan_name" {
  type        = string
  description = "The name of the App Service Plan"
}

variable "app_service_name" {
  type        = string
  description = "The name of the App Service"
}

variable "sku_tier" {
  type        = string
  description = "The pricing tier for the App Service Plan"
  default     = "Standard"
}

variable "sku_size" {
  type        = string
  description = "The instance size for the App Service Plan"
  default     = "S1"
}

variable "dotnet_framework_version" {
  type        = string
  description = "The version of .NET Framework to use for the App Service"
  default     = "v6.0"
}

variable "always_on" {
  type        = bool
  description = "Indicates whether the app should be always on"
  default     = true
}

variable "https_only" {
  type        = bool
  description = "Configures the App Service to only respond to HTTPS requests"
  default     = true
}

variable "minimum_tls_version" {
  type        = string
  description = "The minimum supported TLS version for the app service"
  default     = "1.2"
}

variable "ftps_state" {
  type        = string
  description = "State of FTP / FTPS service for app deployment"
  default     = "FtpsOnly"
}

variable "health_check_path" {
  type        = string
  description = "The health check path to be pinged by App Service"
  default     = "/health"
}

variable "app_settings" {
  type        = map(string)
  description = "A map of key-value pairs for app settings"
  default     = {}
}

variable "connection_strings" {
  type        = list(object({
    name  = string
    type  = string
    value = string
  }))
  description = "A list of connection strings used by the app"
  default     = []
}

variable "tags" {
  type        = map(string)
  description = "A mapping of tags to assign to the resource"
  default     = {}
}

# TODO: Review and adjust default values for variables based on specific project requirements
# TODO: Ensure that the variable names and types align with the main.tf file in the same module
# TODO: Add any additional variables that may be needed for specific Excel API and web application requirements