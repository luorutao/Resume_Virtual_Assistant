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

output "apex_domain" {
  description = "Apex custom domain URL"
  value       = var.site_apex_domain != "" ? "https://${var.site_apex_domain}" : "n/a"
}

output "www_domain" {
  description = "www custom domain URL"
  value       = var.site_www_domain != "" ? "https://${var.site_www_domain}" : "n/a"
}

output "apex_dns_txt_token" {
  description = "Add this as a TXT record at _dnsauth.rutaojames.cv to verify apex domain ownership"
  value       = length(azurerm_static_web_app_custom_domain.apex) > 0 ? azurerm_static_web_app_custom_domain.apex[0].validation_token : "n/a"
}

output "dns_setup_instructions" {
  description = "DNS records to create at your registrar"
  value       = <<-EOT
    Add these DNS records at your domain registrar:

    1. Apex domain verification (TXT):
       Name:  _dnsauth.rutaojames.cv
       Type:  TXT
       Value: <see apex_dns_txt_token output above>

    2. Apex domain routing (ALIAS / ANAME / CNAME-flattening):
       Name:  rutaojames.cv   (or @ )
       Type:  ALIAS or ANAME  (Cloudflare: CNAME with proxy disabled)
       Value: ${azurerm_static_web_app.portfolio.default_host_name}

    3. www subdomain (CNAME):
       Name:  www.rutaojames.cv   (or www)
       Type:  CNAME
       Value: ${azurerm_static_web_app.portfolio.default_host_name}
  EOT
}
