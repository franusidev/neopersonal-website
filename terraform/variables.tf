variable "subscription_id" {
  description = "The id of the subscription"
  type        = string
  
}
variable "resource_group_name" {
  description = "Name of the resource group."
  type        = string
}

variable "location" {
  description = "Azure region."
  type        = string
  default     = "spaincentral"
}

variable "static_webapp_name" {
  description = "Name of the Azure Static Web App."
  type        = string
}
