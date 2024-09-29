terraform {
  required_version = ">= 0.14.9"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 2.65"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }

  backend "azurerm" {
    resource_group_name  = "${var.backend_resource_group_name}"
    storage_account_name = "${var.backend_storage_account_name}"
    container_name       = "${var.backend_container_name}"
    key                  = "terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = "rg-excel-${var.environment}"
  location = var.location
}

module "azure_sql" {
  source                      = "./modules/azure_sql"
  name                        = "excel_sql_${var.environment}"
  resource_group_name         = azurerm_resource_group.main.name
  location                    = var.location
  administrator_login         = var.sql_admin_username
  administrator_login_password = var.sql_admin_password
}

module "azure_cosmos_db" {
  source              = "./modules/azure_cosmos_db"
  name                = "excel_cosmos_${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  consistency_level   = "Session"
}

module "azure_blob_storage" {
  source                   = "./modules/azure_blob_storage"
  name                     = "excel_storage_${var.environment}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "GRS"
}

module "azure_app_service" {
  source              = "./modules/azure_app_service"
  name                = "excel_app_${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  app_service_plan_id = azurerm_app_service_plan.main.id
  app_settings = {
    WEBSITE_NODE_DEFAULT_VERSION = "~14"
    APPINSIGHTS_INSTRUMENTATIONKEY = azurerm_application_insights.main.instrumentation_key
  }
}

# TODO: Add azurerm_app_service_plan and azurerm_application_insights resources

# Human tasks:
# 1. Review and adjust resource naming conventions to align with company standards
# 2. Verify that all required variables are defined in variables.tf
# 3. Ensure that sensitive information (like database credentials) are stored securely and not in plain text
# 4. Confirm that the selected Azure regions (locations) are appropriate for the application's requirements