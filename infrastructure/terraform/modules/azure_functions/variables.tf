variable "resource_group_name" {
  description = "The name of the resource group in which to create the Azure Functions"
  type        = string
}

variable "location" {
  description = "The Azure region in which to create the Azure Functions"
  type        = string
}

variable "function_app_name" {
  description = "The name of the Azure Function App"
  type        = string
}

variable "storage_account_name" {
  description = "The name of the storage account for the Azure Function App"
  type        = string
}

variable "app_service_plan_id" {
  description = "The ID of the App Service Plan for the Azure Function App"
  type        = string
}

variable "runtime_stack" {
  description = "The runtime stack for the Azure Function App"
  type        = string
  default     = "node"
}

variable "runtime_version" {
  description = "The version of the runtime stack for the Azure Function App"
  type        = string
  default     = "~14"
}

variable "app_settings" {
  description = "A map of key-value pairs for App Settings and custom values"
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "A mapping of tags to assign to the resources"
  type        = map(string)
  default     = {}
}

variable "https_only" {
  description = "Disable HTTP access to the Azure Function App"
  type        = bool
  default     = true
}

variable "enable_builtin_logging" {
  description = "Enable built-in logging for Azure Functions"
  type        = bool
  default     = true
}

variable "functions_extension_version" {
  description = "The runtime version associated with the Function App"
  type        = string
  default     = "~4"
}

variable "identity_type" {
  description = "The type of Managed Service Identity that should be configured on this Azure Function App"
  type        = string
  default     = "SystemAssigned"
}

variable "application_insights_key" {
  description = "The Instrumentation Key for connecting the Function App to Application Insights"
  type        = string
  default     = ""
}

variable "subnet_id" {
  description = "The ID of the subnet the app service will be associated to (VNet integration)"
  type        = string
  default     = null
}