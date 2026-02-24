variable "location" {
  description = "Azure region"
  type        = string
  default     = "eastus2"
}

variable "environment" {
  description = "Deployment environment (prod, staging)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Project identifier used in resource names"
  type        = string
  default     = "rutao-portfolio"
}

variable "site_custom_domain" {
  description = "Custom domain for the site (e.g. rutaoluo.com). Leave empty for the default *.azurestaticapps.net domain."
  type        = string
  default     = ""
}

variable "github_repo_url" {
  description = "Full HTTPS GitHub repo URL (e.g. https://github.com/rutaoluo/portfolio)"
  type        = string
  default     = "https://github.com/rutaoluo/portfolio"
}

variable "github_branch" {
  description = "Branch to deploy from"
  type        = string
  default     = "main"
}
