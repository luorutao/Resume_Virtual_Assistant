# ── Resource Group ────────────────────────────────────────────────────────────

resource "azurerm_resource_group" "portfolio" {
  name     = "${var.project_name}-${var.environment}-rg"
  location = var.location

  tags = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

# ── Azure Static Web App ──────────────────────────────────────────────────────
# Free tier: 100 GB/month bandwidth, custom domain with free TLS, global CDN
# Docs: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/static_web_app

resource "azurerm_static_web_app" "portfolio" {
  name                = "${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.portfolio.name
  location            = var.location
  sku_tier            = "Free"   # Free supports 1 custom domain + 100 GB bandwidth
  sku_size            = "Free"

  tags = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

# ── Custom Domains ────────────────────────────────────────────────────────────
# Free tier supports 2 custom domains; both get free managed TLS certificates.

# Apex domain (rutaojames.cv)
# Validated via DNS TXT record: _dnsauth.rutaojames.cv → validation_token output
# Routing: add an ALIAS / ANAME / CNAME-flattening record at your DNS provider
#   pointing rutaojames.cv → <default_host_name output>
resource "azurerm_static_web_app_custom_domain" "apex" {
  count             = var.site_apex_domain != "" ? 1 : 0
  static_web_app_id = azurerm_static_web_app.portfolio.id
  domain_name       = var.site_apex_domain
  validation_type   = "dns-txt-token"
}

# www subdomain (www.rutaojames.cv)
# Validated automatically via CNAME delegation — no separate TXT record needed.
# Routing: add a CNAME record pointing www.rutaojames.cv → <default_host_name output>
resource "azurerm_static_web_app_custom_domain" "www" {
  count             = var.site_www_domain != "" ? 1 : 0
  static_web_app_id = azurerm_static_web_app.portfolio.id
  domain_name       = var.site_www_domain
  validation_type   = "cname-delegation"
}
