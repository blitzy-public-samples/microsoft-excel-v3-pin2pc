variable "cdn_profile_name" {
  type        = string
  description = "Name of the Azure CDN Profile"
  default     = null
}

variable "cdn_sku" {
  type        = string
  description = "SKU of the Azure CDN Profile (Standard_Akamai, Standard_ChinaCdn, Standard_Microsoft, Standard_Verizon or Premium_Verizon)"
  default     = "Standard_Microsoft"
}

variable "cdn_endpoint_name" {
  type        = string
  description = "Name of the Azure CDN Endpoint"
  default     = null
}

variable "origin_host_header" {
  type        = string
  description = "The host header CDN provider will send along with content requests to origins"
  default     = null
}

variable "origins" {
  type = list(object({
    name      = string
    host_name = string
  }))
  description = "List of origins for the CDN endpoint"
  default     = []
}

variable "resource_group_name" {
  type        = string
  description = "Name of the resource group where the CDN resources will be created"
  default     = null
}

variable "location" {
  type        = string
  description = "Azure region where the CDN resources will be created"
  default     = null
}

# Human tasks:
# TODO: Review and adjust default values for variables if needed
# TODO: Add any additional variables required for specific CDN configurations
# TODO: Ensure variable descriptions are clear and accurate for team understanding