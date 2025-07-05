terraform {
  backend "azurerm" {
    resource_group_name  = "rg-tfstate-prod-spc"
    storage_account_name = "sttfstateprodspc"
    container_name       = "stct-neopersonalwebsite-prod-spc"
    key                  = "terraform.tfstate"
  }
}
