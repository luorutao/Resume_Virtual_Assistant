output "static_web_app_name" {
  description = "Azure Static Web App name"
  value       = azurerm_static_web_app.portfolio.name
}

output "default_host_name" {
  description = "Public URL of the site (*.azurestaticapps.net)"
  value       = "https://${azurerm_static_web_app.portfolio.default_host_name}"
}

output "api_key" {
  description = "Deployment token — add as AZURE_STATIC_WEB_APPS_API_TOKEN in GitHub repo secrets"
  value       = azurerm_static_web_app.portfolio.api_key
  sensitive   = true
}

output "resource_group_name" {
  description = "Resource group name"
  value       = azurerm_resource_group.portfolio.name
}

output "custom_domain" {
  description = "Custom domain (if configured)"
  value       = var.site_custom_domain != "" ? "https://${var.site_custom_domain}" : "n/a"
}
