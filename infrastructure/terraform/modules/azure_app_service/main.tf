# Provider configuration
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 2.0"
    }
  }
}

# Variables
variable "app_service_name" {
  type        = string
  description = "Name of the App Service"
}

variable "resource_group_name" {
  type        = string
  description = "Name of the resource group"
}

variable "location" {
  type        = string
  description = "Azure region for resource deployment"
}

variable "sku_tier" {
  type        = string
  description = "SKU tier for the App Service Plan"
}

variable "sku_size" {
  type        = string
  description = "SKU size for the App Service Plan"
}

# Resource Group
resource "azurerm_resource_group" "excel_app_rg" {
  name     = var.resource_group_name
  location = var.location
}

# App Service Plan
resource "azurerm_app_service_plan" "excel_app_plan" {
  name                = "${var.app_service_name}-plan"
  location            = azurerm_resource_group.excel_app_rg.location
  resource_group_name = azurerm_resource_group.excel_app_rg.name
  kind                = "Windows"
  reserved            = false

  sku {
    tier = var.sku_tier
    size = var.sku_size
  }
}

# App Service
resource "azurerm_app_service" "excel_app" {
  name                = var.app_service_name
  location            = azurerm_resource_group.excel_app_rg.location
  resource_group_name = azurerm_resource_group.excel_app_rg.name
  app_service_plan_id = azurerm_app_service_plan.excel_app_plan.id

  site_config {
    dotnet_framework_version = "v5.0"
    scm_type                 = "LocalGit"
    always_on                = true
    websockets_enabled       = true
  }

  app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION" = "14.15.1"
    "WEBSITE_RUN_FROM_PACKAGE"     = "1"
    # Add other app settings here
  }

  connection_string {
    name  = "DefaultConnection"
    type  = "SQLAzure"
    value = "Server=tcp:yourserver.database.windows.net;Database=yourdb;User ID=youruserid;Password=yourpassword;Trusted_Connection=False;Encrypt=True;"
  }
}

# Outputs
output "app_service_name" {
  value       = azurerm_app_service.excel_app.name
  description = "The name of the created App Service"
}

output "app_service_default_hostname" {
  value       = azurerm_app_service.excel_app.default_site_hostname
  description = "The default hostname of the created App Service"
}

# Human tasks (commented)
# TODO: Review and adjust the SKU tier and size variables based on the expected load for the Excel web application
# TODO: Configure appropriate app settings and connection strings for the Excel application
# TODO: Set up proper security and compliance settings for the App Service