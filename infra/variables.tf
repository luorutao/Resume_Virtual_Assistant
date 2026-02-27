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

variable "site_apex_domain" {
  description = "Apex (root) domain, e.g. rutaojames.cv. Leave empty to skip."
  type        = string
  default     = "rutaojames.cv"
}

variable "site_www_domain" {
  description = "www subdomain, e.g. www.rutaojames.cv. Leave empty to skip."
  type        = string
  default     = "www.rutaojames.cv"
}

variable "deepseek_api_key" {
  description = "DeepSeek API key for the chatbot Azure Function"
  type        = string
  sensitive   = true
  default     = ""
}

variable "appinsights_connection_string" {
  description = "Application Insights connection string for server-side Function logging"
  type        = string
  sensitive   = true
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
