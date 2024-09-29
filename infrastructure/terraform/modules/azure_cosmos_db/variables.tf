variable "resource_group_name" {
  type        = string
  description = "The name of the resource group in which to create the Cosmos DB account."
}

variable "location" {
  type        = string
  description = "The location/region where the Cosmos DB account is created. Changing this forces a new resource to be created."
}

variable "account_name" {
  type        = string
  description = "Specifies the name of the Cosmos DB account. Changing this forces a new resource to be created."
}

variable "offer_type" {
  type        = string
  description = "Specifies the Offer Type to use for this Cosmos DB account - currently this can only be set to Standard."
  default     = "Standard"
}

variable "kind" {
  type        = string
  description = "Specifies the Kind of Cosmos DB to create - possible values are GlobalDocumentDB and MongoDB."
  default     = "GlobalDocumentDB"
}

variable "consistency_level" {
  type        = string
  description = "The Consistency Level to use for this Cosmos DB account - can be either BoundedStaleness, Eventual, Session, Strong or ConsistentPrefix."
  default     = "Session"
}

variable "max_interval_in_seconds" {
  type        = number
  description = "When used with the Bounded Staleness consistency level, this value represents the time amount of staleness (in seconds) tolerated. Accepted range for this value is 5 - 86400 (1 day)."
  default     = 5
}

variable "max_staleness_prefix" {
  type        = number
  description = "When used with the Bounded Staleness consistency level, this value represents the number of stale requests tolerated. Accepted range for this value is 10 – 2147483647."
  default     = 100
}

variable "failover_location" {
  type        = string
  description = "The name of the Azure region to host replicated data."
}

variable "database_name" {
  type        = string
  description = "The name of the Cosmos DB database."
}

variable "container_name" {
  type        = string
  description = "The name of the Cosmos DB container."
}

variable "throughput" {
  type        = number
  description = "The throughput of the Cosmos DB container (RU/s). Must be set in increments of 100. The minimum value is 400."
  default     = 400
}

variable "partition_key_path" {
  type        = string
  description = "The partition key path for the Cosmos DB container. The partition key is used to partition the data into logical partitions."
  default     = "/id"
}

variable "tags" {
  type        = map(string)
  description = "A mapping of tags to assign to the resource."
  default     = {}
}

# Human tasks (commented):
# TODO: Review and adjust default values for variables based on specific project requirements
# TODO: Ensure that the failover_location variable is set to an appropriate Azure region for disaster recovery
# TODO: Validate that the throughput value meets the performance requirements of the application
# TODO: Confirm that the partition_key_path is set correctly for optimal data distribution