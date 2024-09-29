# Azure SQL Database Terraform Module

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
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
}

# Azure SQL Server
resource "azurerm_sql_server" "main" {
  name                         = var.sql_server_name
  resource_group_name          = azurerm_resource_group.main.name
  location                     = azurerm_resource_group.main.location
  version                      = "12.0"
  administrator_login          = var.admin_username
  administrator_login_password = var.admin_password
}

# Azure SQL Database
resource "azurerm_sql_database" "main" {
  name                = var.database_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  server_name         = azurerm_sql_server.main.name
  edition             = var.database_edition
  requested_service_objective_name = var.database_service_objective
}

# Azure SQL Firewall Rule to allow Azure services
resource "azurerm_sql_firewall_rule" "allow_azure_services" {
  name                = "AllowAzureServices"
  resource_group_name = azurerm_resource_group.main.name
  server_name         = azurerm_sql_server.main.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

# Outputs
output "sql_server_fqdn" {
  value       = azurerm_sql_server.main.fully_qualified_domain_name
  description = "The fully qualified domain name of the Azure SQL Server"
}

output "sql_database_name" {
  value       = azurerm_sql_database.main.name
  description = "The name of the Azure SQL Database"
}

output "sql_connection_string" {
  value       = "Server=tcp:${azurerm_sql_server.main.fully_qualified_domain_name},1433;Initial Catalog=${azurerm_sql_database.main.name};Persist Security Info=False;User ID=${var.admin_username};Password=${var.admin_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  description = "Connection string for the Azure SQL Database"
  sensitive   = true
}

# Human tasks (commented)
# TODO: Review and adjust the database_edition and database_service_objective variables to ensure they meet the performance requirements of the Excel application
# TODO: Implement proper secret management for the admin_password variable, possibly using Azure Key Vault or another secure secret management solution
# TODO: Consider adding additional firewall rules if specific IP ranges need access to the Azure SQL Database