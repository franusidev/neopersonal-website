output "static_webapp_url" {
  description = "URL of the Azure Static Web App."
  value       = azurerm_static_web_app.staticweb.default_host_name
}
