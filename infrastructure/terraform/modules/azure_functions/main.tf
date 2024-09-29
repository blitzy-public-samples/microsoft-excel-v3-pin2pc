# Azure Functions Module

# Provider configuration
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 2.0"
    }
  }
}

# Resource Group
resource "azurerm_resource_group" "functions_rg" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

# Storage account for Azure Functions
resource "azurerm_storage_account" "functions_storage" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.functions_rg.name
  location                 = azurerm_resource_group.functions_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  tags                     = var.tags
}

# App Service Plan for Azure Functions
resource "azurerm_app_service_plan" "functions_plan" {
  name                = var.app_service_plan_name
  location            = azurerm_resource_group.functions_rg.location
  resource_group_name = azurerm_resource_group.functions_rg.name
  kind                = "FunctionApp"

  sku {
    tier = var.app_service_plan_tier
    size = var.app_service_plan_size
  }

  tags = var.tags
}

# Azure Function App
resource "azurerm_function_app" "function_app" {
  name                       = var.function_app_name
  location                   = azurerm_resource_group.functions_rg.location
  resource_group_name        = azurerm_resource_group.functions_rg.name
  app_service_plan_id        = azurerm_app_service_plan.functions_plan.id
  storage_account_name       = azurerm_storage_account.functions_storage.name
  storage_account_access_key = azurerm_storage_account.functions_storage.primary_access_key
  version                    = "~3"

  app_settings = {
    FUNCTIONS_WORKER_RUNTIME = var.function_runtime
    WEBSITE_NODE_DEFAULT_VERSION = "~14"
    APPINSIGHTS_INSTRUMENTATIONKEY = azurerm_application_insights.function_insights.instrumentation_key
  }

  site_config {
    always_on        = true
    min_tls_version  = "1.2"
    ftps_state       = "Disabled"
    http2_enabled    = true
    cors {
      allowed_origins = var.allowed_origins
    }
  }

  identity {
    type = "SystemAssigned"
  }

  tags = var.tags
}

# Application Insights for Azure Functions
resource "azurerm_application_insights" "function_insights" {
  name                = "${var.function_app_name}-insights"
  location            = azurerm_resource_group.functions_rg.location
  resource_group_name = azurerm_resource_group.functions_rg.name
  application_type    = "web"
  tags                = var.tags
}

# Output the Function App's default hostname
output "function_app_default_hostname" {
  value = azurerm_function_app.function_app.default_hostname
}

# Output the Function App's principal ID for role assignments
output "function_app_principal_id" {
  value = azurerm_function_app.function_app.identity[0].principal_id
}