terraform {
  required_version = ">= 1.5"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.110"
    }
  }

  # Recommended: store state in Azure Blob Storage (uncomment after creating the storage account)
  # backend "azurerm" {
  #   resource_group_name  = "rutao-portfolio-tf-state"
  #   storage_account_name = "rutaoportfoliotfstate"
  #   container_name       = "tfstate"
  #   key                  = "portfolio.tfstate"
  # }
}

provider "azurerm" {
  features {}
  # Authentication: use az login locally, or set env vars for CI:
  #   ARM_CLIENT_ID, ARM_CLIENT_SECRET, ARM_TENANT_ID, ARM_SUBSCRIPTION_ID
  # OR use OIDC (workload identity federation) — recommended for GitHub Actions
}
