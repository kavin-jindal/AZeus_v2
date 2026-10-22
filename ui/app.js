// Sample enumeration data representing Azure Tenant, Subscription, and Key Vault discovery output
const ENUMERATION_DATA = {
  tenant: {
    name: "Contoso Enterprise",
    tenantId: "00000000-0000-0000-0000-000000000000",
    primaryDomain: "contoso.onmicrosoft.com",
    directoryType: "Microsoft Entra ID (P2 Premium)",
    country: "United States (US)",
    cloudEnvironment: "AzureCloud (Commercial)",
    authMethod: "Azure CLI (az login OAuth2)",
    account: "pentest-auditor@secops.azure.internal",
    accountRoles: "Security Reader + Key Vault Contributor"
  },
  subscription: {
    displayName: "Production-Core-EastUS",
    subscriptionId: "11111111-1111-1111-1111-111111111111",
    state: "Active (Enabled)",
    spendingLimit: "Enterprise Agreement (EA Tier-1)",
    managementGroup: "mg-core-enterprise-prod",
    region: "EastUS",
    resourceGroupCount: 4,
    tags: {
      "Environment": "Production",
      "CostCenter": "SecOps-CyberSec-904",
      "Owner": "security-team@contoso.com",
      "Compliance": "PCI-DSS / ISO27001 / SOC2"
    }
  },
  resourceGroups: [
    {
      id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod",
      name: "rg-core-services-prod",
      location: "East US",
      status: "Healthy",
      provisioningState: "Succeeded",
      tags: { Environment: "Production", Tier: "Core Services", Owner: "Platform Ops" },
      keyVaults: ["kv-prod-backend-eus"],
      resources: 14,
      items: [
        { name: "kv-prod-backend-eus", type: "Microsoft.KeyVault/vaults", category: "keyvault", location: "East US", status: "Accessible", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.KeyVault/vaults/kv-prod-backend-eus" },
        { name: "vm-core-backend-01", type: "Microsoft.Compute/virtualMachines", category: "compute", location: "East US", status: "Running (Ubuntu 22.04)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.Compute/virtualMachines/vm-core-backend-01" },
        { name: "vm-core-backend-02", type: "Microsoft.Compute/virtualMachines", category: "compute", location: "East US", status: "Running (Ubuntu 22.04)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.Compute/virtualMachines/vm-core-backend-02" },
        { name: "disk-core-backend-01-os", type: "Microsoft.Compute/disks", category: "compute", location: "East US", status: "Attached (Premium SSD)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.Compute/disks/disk-core-backend-01-os" },
        { name: "stprodcoredataeus", type: "Microsoft.Storage/storageAccounts", category: "storage", location: "East US", status: "Active (Standard_RAGRS)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.Storage/storageAccounts/stprodcoredataeus" },
        { name: "stprodlogsarchiveeus", type: "Microsoft.Storage/storageAccounts", category: "storage", location: "East US", status: "Active (Standard_GRS)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.Storage/storageAccounts/stprodlogsarchiveeus" },
        { name: "sql-prod-eus", type: "Microsoft.Sql/servers", category: "storage", location: "East US", status: "Online (TLS 1.2 Required)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.Sql/servers/sql-prod-eus" },
        { name: "sql-prod-eus/core_db", type: "Microsoft.Sql/servers/databases", category: "storage", location: "East US", status: "Online (General Purpose, 8 vCores)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.Sql/servers/sql-prod-eus/databases/core_db" },
        { name: "vnet-prod-core-eus", type: "Microsoft.Network/virtualNetworks", category: "network", location: "East US", status: "10.100.0.0/16 (3 Subnets)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.Network/virtualNetworks/vnet-prod-core-eus" },
        { name: "nsg-core-backend-eus", type: "Microsoft.Network/networkSecurityGroups", category: "network", location: "East US", status: "Enforced (8 Security Rules)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.Network/networkSecurityGroups/nsg-core-backend-eus" },
        { name: "pip-core-lb-eus", type: "Microsoft.Network/publicIPAddresses", category: "network", location: "East US", status: "Static (198.51.100.10)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.Network/publicIPAddresses/pip-core-lb-eus" },
        { name: "lb-core-internal-eus", type: "Microsoft.Network/loadBalancers", category: "network", location: "East US", status: "Standard Zone-Redundant", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.Network/loadBalancers/lb-core-internal-eus" },
        { name: "app-core-api-eus", type: "Microsoft.Web/sites", category: "compute", location: "East US", status: "Running (Linux Python 3.11)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.Web/sites/app-core-api-eus" },
        { name: "appi-core-telemetry", type: "Microsoft.Insights/components", category: "insights", location: "East US", status: "Ingesting Telemetry", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.Insights/components/appi-core-telemetry" }
      ]
    },
    {
      id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-payment-pci-prod",
      name: "rg-payment-pci-prod",
      location: "East US 2",
      status: "Restricted",
      provisioningState: "Succeeded",
      tags: { Environment: "Production", Scope: "PCI-DSS", Audit: "Strict" },
      keyVaults: ["kv-payment-service-pci"],
      resources: 8,
      items: [
        { name: "kv-payment-service-pci", type: "Microsoft.KeyVault/vaults", category: "keyvault", location: "East US 2", status: "Restricted (HSM Backed)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-payment-pci-prod/providers/Microsoft.KeyVault/vaults/kv-payment-service-pci" },
        { name: "vm-pci-hsm-processor-01", type: "Microsoft.Compute/virtualMachines", category: "compute", location: "East US 2", status: "Running (Isolated Enclave)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-payment-pci-prod/providers/Microsoft.Compute/virtualMachines/vm-pci-hsm-processor-01" },
        { name: "vm-pci-hsm-processor-02", type: "Microsoft.Compute/virtualMachines", category: "compute", location: "East US 2", status: "Running (Isolated Enclave)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-payment-pci-prod/providers/Microsoft.Compute/virtualMachines/vm-pci-hsm-processor-02" },
        { name: "stpciencryptedtokens", type: "Microsoft.Storage/storageAccounts", category: "storage", location: "East US 2", status: "CMK Encrypted (Blob/Table)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-payment-pci-prod/providers/Microsoft.Storage/storageAccounts/stpciencryptedtokens" },
        { name: "sql-pci-audit-eus2", type: "Microsoft.Sql/servers", category: "storage", location: "East US 2", status: "Online (Auditing Enabled)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-payment-pci-prod/providers/Microsoft.Sql/servers/sql-pci-audit-eus2" },
        { name: "vnet-pci-isolated-eus2", type: "Microsoft.Network/virtualNetworks", category: "network", location: "East US 2", status: "10.200.0.0/20 (Airgapped Subnet)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-payment-pci-prod/providers/Microsoft.Network/virtualNetworks/vnet-pci-isolated-eus2" },
        { name: "nsg-pci-restricted", type: "Microsoft.Network/networkSecurityGroups", category: "network", location: "East US 2", status: "Zero Trust Enforced", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-payment-pci-prod/providers/Microsoft.Network/networkSecurityGroups/nsg-pci-restricted" },
        { name: "waf-payment-gateway", type: "Microsoft.Network/applicationGateways", category: "network", location: "East US 2", status: "WAF_v2 OWASP 3.2 Active", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-payment-pci-prod/providers/Microsoft.Network/applicationGateways/waf-payment-gateway" }
      ]
    },
    {
      id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-sandbox-dev",
      name: "rg-sandbox-dev",
      location: "East US",
      status: "Dev Sandbox",
      provisioningState: "Succeeded",
      tags: { Environment: "Development", AutoShutdown: "Enabled (19:00 UTC)" },
      keyVaults: ["kv-dev-sandbox-eus"],
      resources: 6,
      items: [
        { name: "kv-dev-sandbox-eus", type: "Microsoft.KeyVault/vaults", category: "keyvault", location: "East US", status: "Accessible", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-sandbox-dev/providers/Microsoft.KeyVault/vaults/kv-dev-sandbox-eus" },
        { name: "vm-sandbox-testbox-01", type: "Microsoft.Compute/virtualMachines", category: "compute", location: "East US", status: "Stopped (Deallocated)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-sandbox-dev/providers/Microsoft.Compute/virtualMachines/vm-sandbox-testbox-01" },
        { name: "stsandboxdevdata", type: "Microsoft.Storage/storageAccounts", category: "storage", location: "East US", status: "Active (Standard_LRS)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-sandbox-dev/providers/Microsoft.Storage/storageAccounts/stsandboxdevdata" },
        { name: "vnet-sandbox-dev", type: "Microsoft.Network/virtualNetworks", category: "network", location: "East US", status: "10.50.0.0/16", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-sandbox-dev/providers/Microsoft.Network/virtualNetworks/vnet-sandbox-dev" },
        { name: "nsg-sandbox-open", type: "Microsoft.Network/networkSecurityGroups", category: "network", location: "East US", status: "Dev Permissive Rules", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-sandbox-dev/providers/Microsoft.Network/networkSecurityGroups/nsg-sandbox-open" },
        { name: "aks-sandbox-cluster", type: "Microsoft.ContainerService/managedClusters", category: "compute", location: "East US", status: "Running (Kubernetes v1.28.3)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-sandbox-dev/providers/Microsoft.ContainerService/managedClusters/aks-sandbox-cluster" }
      ]
    },
    {
      id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-networking-core",
      name: "rg-networking-core",
      location: "Central US",
      status: "Healthy",
      provisioningState: "Succeeded",
      tags: { Environment: "Production", Role: "Hub Transit", Criticality: "Mission Critical" },
      keyVaults: [],
      resources: 12,
      items: [
        { name: "vnet-hub-transit-centralus", type: "Microsoft.Network/virtualNetworks", category: "network", location: "Central US", status: "10.0.0.0/16 (Transit Hub)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-networking-core/providers/Microsoft.Network/virtualNetworks/vnet-hub-transit-centralus" },
        { name: "fw-azure-firewall-core", type: "Microsoft.Network/azureFirewalls", category: "network", location: "Central US", status: "Premium SKU (TLS Inspection)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-networking-core/providers/Microsoft.Network/azureFirewalls/fw-azure-firewall-core" },
        { name: "pip-firewall-centralus", type: "Microsoft.Network/publicIPAddresses", category: "network", location: "Central US", status: "Static (198.51.100.20)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-networking-core/providers/Microsoft.Network/publicIPAddresses/pip-firewall-centralus" },
        { name: "rt-core-default-route", type: "Microsoft.Network/routeTables", category: "network", location: "Central US", status: "0.0.0.0/0 -> 10.0.1.4 (FW)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-networking-core/providers/Microsoft.Network/routeTables/rt-core-default-route" },
        { name: "erg-gateway-expressroute", type: "Microsoft.Network/virtualNetworkGateways", category: "network", location: "Central US", status: "Connected (1 Gbps Dedicated)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-networking-core/providers/Microsoft.Network/virtualNetworkGateways/erg-gateway-expressroute" },
        { name: "conn-onprem-dc-primary", type: "Microsoft.Network/connections", category: "network", location: "Central US", status: "Active BGP Established", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-networking-core/providers/Microsoft.Network/connections/conn-onprem-dc-primary" },
        { name: "nsg-perimeter-centralus", type: "Microsoft.Network/networkSecurityGroups", category: "network", location: "Central US", status: "Perimeter Shield Enforced", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-networking-core/providers/Microsoft.Network/networkSecurityGroups/nsg-perimeter-centralus" },
        { name: "bastion-core-centralus", type: "Microsoft.Network/bastionHosts", category: "network", location: "Central US", status: "Standard SKU Running", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-networking-core/providers/Microsoft.Network/bastionHosts/bastion-core-centralus" },
        { name: "pip-bastion-centralus", type: "Microsoft.Network/publicIPAddresses", category: "network", location: "Central US", status: "Static (198.51.100.30)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-networking-core/providers/Microsoft.Network/publicIPAddresses/pip-bastion-centralus" },
        { name: "dns-private-core-zone", type: "Microsoft.Network/privateDnsZones", category: "network", location: "Global", status: "corp.contoso.cloud (Linked)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-networking-core/providers/Microsoft.Network/privateDnsZones/dns-private-core-zone" },
        { name: "ddos-protection-core", type: "Microsoft.Network/ddosProtectionPlans", category: "network", location: "Central US", status: "Network Protection Active", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-networking-core/providers/Microsoft.Network/ddosProtectionPlans/ddos-protection-core" },
        { name: "stnetworkflowlogs", type: "Microsoft.Storage/storageAccounts", category: "storage", location: "Central US", status: "Active (NSG Flow Logs)", id: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-networking-core/providers/Microsoft.Storage/storageAccounts/stnetworkflowlogs" }
      ]
    }
  ],
  reconTimeline: [
    { time: "12:28:02", event: "Authenticated via Azure CLI token (Subject: pentest-auditor@secops.azure.internal)", alert: false },
    { time: "12:28:05", event: "Resolved Tenant ID: 00000000-0000-0000-0000-000000000000 (Contoso SecOps)", alert: false },
    { time: "12:28:09", event: "Targeted Subscription: Production-Core-EastUS (11111111-1111-1111-1111-111111111111)", alert: false },
    { time: "12:28:12", event: "Enumerated 4 Resource Groups across East US, East US 2, and Central US", alert: false },
    { time: "12:28:15", event: "Discovered 3 Azure Key Vault instances via Microsoft.KeyVault/vaults provider", alert: false },
    { time: "12:28:20", event: "Extracted 5 secrets & 3 keys from kv-prod-backend-eus", alert: false },
    { time: "12:28:23", event: "Validated strict RBAC segregation on kv-payment-service-pci", alert: false },
    { time: "12:28:28", event: "Completed reconnaissance mapping for 3 Key Vault instances", alert: false }
  ],
  vaults: [
    {
      id: "kv-prod-backend-eus",
      name: "kv-prod-backend-eus",
      resourceGroup: "rg-core-services-prod",
      location: "eastus",
      uri: "https://kv-prod-backend-eus.vault.azure.net/",
      resourceId: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-core-services-prod/providers/Microsoft.KeyVault/vaults/kv-prod-backend-eus",
      status: "accessible",
      rbacAuth: true,
      softDelete: "90 Days (Enabled)",
      purgeProtection: "Enabled",
      publicNetwork: "Firewalled",
      secrets: [
        { name: "db-admin-connection-string", value: "Server=tcp:sql-prod-eus.database.windows.net,1433;Initial Catalog=core_db;User ID=az_admin;Password=PlaceholderPassword123!;", contentType: "connection-string", updated: "2026-03-12" },
        { name: "stripe-api-secret-key", value: "sk_test_placeholder_key_000000000000000000", contentType: "api-key", updated: "2026-02-28" },
        { name: "jwt-signing-private-secret", value: "ZXhhbXBsZV9qd3Rfc2VjcmV0X3BsYWNlaG9sZGVy", contentType: "jwt-secret", updated: "2026-01-15" },
        { name: "sendgrid-smtp-password", value: "SG.placeholder_token.placeholder_secret_value", contentType: "smtp-credentials", updated: "2025-11-20" },
        { name: "redis-cache-primary-key", value: "cGxhY2Vob2xkZXJfcmVkaXNfa2V5XzEyMw==", contentType: "redis-auth", updated: "2026-04-01" }
      ],
      keys: [
        { name: "data-encryption-master-key", type: "RSA (3072-bit)", status: "Enabled", ops: ["encrypt", "decrypt", "wrapKey", "unwrapKey"], updated: "2026-01-10" },
        { name: "token-signing-key-ec", type: "EC (P-256)", status: "Enabled", ops: ["sign", "verify"], updated: "2026-02-05" },
        { name: "backup-archive-key", type: "RSA (4096-bit)", status: "Enabled", ops: ["unwrapKey", "decrypt"], updated: "2025-08-14" }
      ],
      certificates: [
        { name: "api-internal-wildcard-cert", thumbprint: "B3:9F:8A:10:44:CD:7E:21:88:51:FF", expires: "2027-04-10", autoRenew: "Enabled" },
        { name: "gateway-client-auth", thumbprint: "1A:82:F9:5C:33:41:A2:9D:60:11:0E", expires: "2026-11-15", autoRenew: "Enabled" }
      ]
    },
    {
      id: "kv-payment-service-pci",
      name: "kv-payment-service-pci",
      resourceGroup: "rg-payment-pci-prod",
      location: "eastus2",
      uri: "https://kv-payment-service-pci.vault.azure.net/",
      resourceId: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-payment-pci-prod/providers/Microsoft.KeyVault/vaults/kv-payment-service-pci",
      status: "restricted",
      rbacAuth: true,
      softDelete: "90 Days (Enabled)",
      purgeProtection: "Enabled",
      publicNetwork: "Private Link Only",
      secrets: [
        { name: "pci-hsm-pin-block-key", value: "[403 Forbidden: Missing Microsoft.KeyVault/vaults/secrets/getSecret permission]", contentType: "hsm-key", updated: "2025-10-02" },
        { name: "processor-webhook-hmac", value: "[403 Forbidden: Missing Microsoft.KeyVault/vaults/secrets/getSecret permission]", contentType: "hmac-secret", updated: "2026-01-19" }
      ],
      keys: [
        { name: "pci-envelope-key", type: "RSA-HSM (4096-bit)", status: "Enabled", ops: ["wrapKey", "unwrapKey"], updated: "2025-09-12" }
      ],
      certificates: [
        { name: "pci-mutual-tls-ca", thumbprint: "EE:71:04:99:A1:BC:48:F2:19:90:3C", expires: "2026-08-30", autoRenew: "Disabled" }
      ]
    },
    {
      id: "kv-dev-sandbox-eus",
      name: "kv-dev-sandbox-eus",
      resourceGroup: "rg-sandbox-dev",
      location: "eastus",
      uri: "https://kv-dev-sandbox-eus.vault.azure.net/",
      resourceId: "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-sandbox-dev/providers/Microsoft.KeyVault/vaults/kv-dev-sandbox-eus",
      status: "accessible",
      rbacAuth: false,
      softDelete: "Disabled",
      purgeProtection: "Disabled",
      publicNetwork: "Enabled",
      secrets: [
        { name: "dev-mongodb-uri", value: "mongodb://app_user:PlaceholderPass123!@127.0.0.1:27017/sandbox", contentType: "mongodb-uri", updated: "2026-04-10" },
        { name: "staging-github-pat", value: "ghp_placeholderToken00000000000000000000", contentType: "github-pat", updated: "2026-03-29" },
        { name: "datadog-agent-api-key", value: "00000000000000000000000000000000", contentType: "api-key", updated: "2026-02-14" }
      ],
      keys: [
        { name: "dev-symmetric-test", type: "oct (256-bit)", status: "Enabled", ops: ["encrypt", "decrypt"], updated: "2026-03-01" }
      ],
      certificates: []
    }
  ]
};

let currentVaultId = ENUMERATION_DATA.vaults[0].id;
let currentRgName = ENUMERATION_DATA.resourceGroups[0].name;
let activeRgCategoryFilter = "all";
let currentView = "dashboard";

function getDashboardUrl() {
  if (window.location.pathname.endsWith(".html")) return "index.html";
  return "/home";
}

function getKeyVaultUrl() {
  if (window.location.pathname.endsWith(".html")) return "keyvault.html";
  return "/keyvault";
}

function getResourceGroupsUrl() {
  if (window.location.pathname.endsWith(".html")) return "resourcegroups.html";
  return "/resource-groups";
}

function handleNavClick(event, viewName) {
  if (event && (event.metaKey || event.ctrlKey || event.shiftKey)) {
    return true; // allow opening in new tab
  }
  if (event) event.preventDefault();
  navigateTo(viewName);
  return false;
}

function initApp() {
  const hasVaultsView = Boolean(document.getElementById("view-vaults"));
  const hasDashboardView = Boolean(document.getElementById("view-dashboard"));
  const hasRgView = Boolean(document.getElementById("view-resource-groups"));

  // Restore active vault & RG from localStorage if valid
  try {
    const savedVault = localStorage.getItem("az_selected_vault");
    if (savedVault && ENUMERATION_DATA.vaults.some(v => v.id === savedVault)) {
      currentVaultId = savedVault;
    }
    const savedRg = localStorage.getItem("az_selected_rg");
    if (savedRg && ENUMERATION_DATA.resourceGroups.some(rg => rg.name === savedRg)) {
      currentRgName = savedRg;
    }
  } catch (e) {}

  // Render shared framework elements
  renderSidebar();
  renderHeaderAndSidebarInfo();

  if (hasRgView) {
    currentView = "resource-groups";
    const navRgsBtn = document.getElementById("nav-btn-rgs");
    const navDashBtn = document.getElementById("nav-btn-dashboard");
    const navDashBadge = document.getElementById("nav-dash-badge");
    if (navRgsBtn) navRgsBtn.classList.add("active");
    if (navDashBtn) navDashBtn.classList.remove("active");
    if (navDashBadge) navDashBadge.style.display = "none";

    const rg = getActiveResourceGroup();
    const breadcrumbCurrent = document.getElementById("breadcrumb-current-view");
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = `Resource Groups // ${rg.name}`;

    renderActiveResourceGroup();
    renderRgDropdown();
  } else if (hasVaultsView && !hasDashboardView) {
    currentView = "vaults";
    const navVaultsBtn = document.getElementById("nav-btn-vaults");
    const navDashBtn = document.getElementById("nav-btn-dashboard");
    const navDashBadge = document.getElementById("nav-dash-badge");
    if (navVaultsBtn) navVaultsBtn.classList.add("active");
    if (navDashBtn) navDashBtn.classList.remove("active");
    if (navDashBadge) navDashBadge.style.display = "none";

    const vault = getActiveVault();
    const breadcrumbCurrent = document.getElementById("breadcrumb-current-view");
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = `Key Vaults // ${vault.name}`;

    renderActiveVault();
    renderVaultSwitcher();
  } else if (hasDashboardView && !hasVaultsView && !hasRgView) {
    currentView = "dashboard";
    const navDashBtn = document.getElementById("nav-btn-dashboard");
    if (navDashBtn) navDashBtn.classList.add("active");

    renderDashboard();

    // Support deep-linking to hash sections (e.g. #section-tenant-overview)
    if (window.location.hash) {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  } else {
    // Both views on same page (single-page mode fallback)
    renderDashboard();
    renderActiveVault();
    renderVaultSwitcher();
  }

  setupEventListeners();
}

// Navigation between Dashboard, Tenant, Resource Groups & Vaults View
function navigateTo(viewName) {
  currentView = viewName;

  const hasVaultsView = Boolean(document.getElementById("view-vaults"));
  const hasDashboardView = Boolean(document.getElementById("view-dashboard"));
  const hasRgView = Boolean(document.getElementById("view-resource-groups"));

  const navDashboardBtn = document.getElementById("nav-btn-dashboard");
  const navTenantBtn = document.getElementById("nav-btn-tenant");
  const navRgsBtn = document.getElementById("nav-btn-rgs");
  const navVaultsBtn = document.getElementById("nav-btn-vaults");
  const viewDashboard = document.getElementById("view-dashboard");
  const viewVaults = document.getElementById("view-vaults");
  const viewRg = document.getElementById("view-resource-groups");
  const breadcrumbCurrent = document.getElementById("breadcrumb-current-view");

  if (viewName === "vaults") {
    if (!hasVaultsView) {
      window.location.href = getKeyVaultUrl();
      return;
    }
    [navDashboardBtn, navTenantBtn, navRgsBtn].forEach(b => b && b.classList.remove("active"));
    if (navVaultsBtn) navVaultsBtn.classList.add("active");
    if (viewVaults) viewVaults.classList.add("active");
    if (viewDashboard) viewDashboard.classList.remove("active");
    if (viewRg) viewRg.classList.remove("active");
    const vault = getActiveVault();
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = `Key Vaults // ${vault.name}`;
    renderVaultSwitcher();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (viewName === "resource-groups") {
    if (!hasRgView) {
      window.location.href = getResourceGroupsUrl();
      return;
    }
    [navDashboardBtn, navTenantBtn, navVaultsBtn].forEach(b => b && b.classList.remove("active"));
    if (navRgsBtn) navRgsBtn.classList.add("active");
    if (viewRg) viewRg.classList.add("active");
    if (viewDashboard) viewDashboard.classList.remove("active");
    if (viewVaults) viewVaults.classList.remove("active");
    const rg = getActiveResourceGroup();
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = `Resource Groups // ${rg.name}`;
    renderRgDropdown();
    renderActiveResourceGroup();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (viewName === "dashboard") {
    if (!hasDashboardView) {
      window.location.href = getDashboardUrl();
      return;
    }
    [navTenantBtn, navRgsBtn, navVaultsBtn].forEach(b => b && b.classList.remove("active"));
    if (navDashboardBtn) navDashboardBtn.classList.add("active");
    if (viewDashboard) viewDashboard.classList.add("active");
    if (viewVaults) viewVaults.classList.remove("active");
    if (viewRg) viewRg.classList.remove("active");
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Dashboard Overview";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (viewName === "tenant") {
    if (!hasDashboardView) {
      window.location.href = `${getDashboardUrl()}#section-tenant-overview`;
      return;
    }
    [navDashboardBtn, navRgsBtn, navVaultsBtn].forEach(b => b && b.classList.remove("active"));
    if (navTenantBtn) navTenantBtn.classList.add("active");
    if (viewDashboard) viewDashboard.classList.add("active");
    if (viewVaults) viewVaults.classList.remove("active");
    if (viewRg) viewRg.classList.remove("active");
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Tenant & Directory Options";
    const tenantSec = document.getElementById("section-tenant-overview");
    if (tenantSec) tenantSec.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function selectVault(vaultId) {
  currentVaultId = vaultId;
  try {
    localStorage.setItem("az_selected_vault", vaultId);
  } catch (e) {}

  if (typeof closeVaultDropdown === "function") {
    closeVaultDropdown();
  }

  renderVaultSwitcher();
  renderActiveVault();
  
  const breadcrumbCurrent = document.getElementById("breadcrumb-current-view");
  if (breadcrumbCurrent && (currentView === "vaults" || Boolean(document.getElementById("view-vaults")))) {
    const vault = getActiveVault();
    breadcrumbCurrent.textContent = `Key Vaults // ${vault.name}`;
  }
}

function selectVaultAndNavigate(vaultId) {
  selectVault(vaultId);
  const isDashboardOnly = Boolean(document.getElementById("view-dashboard") && !document.getElementById("view-vaults"));
  if (isDashboardOnly) {
    window.location.href = getKeyVaultUrl();
  } else {
    navigateTo("vaults");
  }
}

function getActiveVault() {
  return ENUMERATION_DATA.vaults.find(v => v.id === currentVaultId) || ENUMERATION_DATA.vaults[0];
}

// Common Header & Sidebar metadata population across all pages
function renderHeaderAndSidebarInfo() {
  const { resourceGroups, vaults } = ENUMERATION_DATA;

  const navVaultCount = document.getElementById("nav-vault-count");
  if (navVaultCount) navVaultCount.textContent = vaults.length;

  const navRgCount = document.getElementById("nav-rg-count");
  if (navRgCount) navRgCount.textContent = resourceGroups.length;

  const sidebarRgTotal = document.getElementById("sidebar-rg-total");
  if (sidebarRgTotal) sidebarRgTotal.textContent = `${resourceGroups.length} Active`;
}

// Sync Live Key Vaults Data from Backend
function syncBackendVaults(liveVaults) {
  if (!Array.isArray(liveVaults) || liveVaults.length === 0) return;

  ENUMERATION_DATA.vaults = liveVaults.map(v => {
    return {
      id: v.id || v.name,
      name: v.name,
      resourceGroup: v.resourceGroup || "Azure Managed",
      location: v.location || "eastus",
      uri: v.uri || v.url || `https://${v.name}.vault.azure.net/`,
      resourceId: v.resourceId || v.id || "",
      status: v.status || "accessible",
      rbacAuth: v.rbacAuth !== undefined ? v.rbacAuth : true,
      softDelete: v.softDelete || "Enabled",
      purgeProtection: v.purgeProtection || "Enabled",
      publicNetwork: v.publicNetwork || "Enabled",
      secrets: (v.secrets || []).map(s => ({
        name: s.name,
        value: s.value !== undefined ? s.value : "",
        contentType: s.contentType || s.content_type || "secret",
        updated: s.updated || ""
      })),
      keys: (v.keys || []).map(k => ({
        name: k.name,
        type: k.type || k.key_type || "RSA (2048-bit)",
        status: k.status || (k.enabled_state !== false ? "Enabled" : "Disabled"),
        ops: k.ops || ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
        updated: k.updated || ""
      })),
      certificates: (v.certificates || v.certs || []).map(c => ({
        name: c.name,
        thumbprint: c.thumbprint || "",
        expires: c.expires || "Active",
        autoRenew: c.autoRenew || (c.enabled_state !== false ? "Enabled" : "Disabled")
      }))
    };
  });

  const navVaultCount = document.getElementById("nav-vault-count");
  if (navVaultCount) navVaultCount.textContent = ENUMERATION_DATA.vaults.length;

  if (Boolean(document.getElementById("view-vaults"))) {
    if (!ENUMERATION_DATA.vaults.some(v => v.id === currentVaultId)) {
      currentVaultId = ENUMERATION_DATA.vaults[0].id;
    }
    renderActiveVault();
    renderVaultSwitcher();
  }
}
window.syncBackendVaults = syncBackendVaults;

// Dropdown UI state controls
function openVaultDropdown() {
  const dd = document.getElementById("vault-dropdown");
  const toggle = document.getElementById("vault-dropdown-toggle");
  if (!dd || !toggle) return;
  dd.classList.add("open");
  toggle.setAttribute("aria-expanded", "true");
  const searchInput = document.getElementById("vault-dropdown-search-input");
  if (searchInput) {
    searchInput.focus();
  }
}

function closeVaultDropdown() {
  const dd = document.getElementById("vault-dropdown");
  const toggle = document.getElementById("vault-dropdown-toggle");
  if (!dd) return;
  dd.classList.remove("open");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
  const searchInput = document.getElementById("vault-dropdown-search-input");
  if (searchInput && searchInput.value) {
    searchInput.value = "";
    renderVaultSwitcher("");
  }
}

function toggleVaultDropdown(e) {
  if (e) {
    e.preventDefault();
    if (typeof e.stopImmediatePropagation === "function") {
      e.stopImmediatePropagation();
    } else {
      e.stopPropagation();
    }
  }
  const dd = document.getElementById("vault-dropdown");
  if (!dd) return;
  if (dd.classList.contains("open")) {
    closeVaultDropdown();
  } else {
    openVaultDropdown();
  }
}
window.toggleVaultDropdown = toggleVaultDropdown;
window.openVaultDropdown = openVaultDropdown;
window.closeVaultDropdown = closeVaultDropdown;
window.selectVault = selectVault;

// In-view Vault Switcher Dropdown on Key Vaults Page
function renderVaultSwitcher(filterText = "") {
  const activeVault = getActiveVault();

  // 1. Update Dropdown Toggle Button
  const toggleName = document.getElementById("vault-dd-selected-name");
  if (toggleName) toggleName.textContent = activeVault.name;

  const toggleBadge = document.getElementById("vault-dd-selected-badge");
  if (toggleBadge) toggleBadge.textContent = `${activeVault.secrets.length} secrets`;

  const toggleDot = document.getElementById("vault-dd-status-dot");
  if (toggleDot) {
    toggleDot.className = `status-dot ${activeVault.status === 'restricted' ? 'restricted' : 'accessible'}`;
  }

  // 2. Update Top Bar Quick Context Badges
  const quickRg = document.getElementById("vault-quick-rg");
  if (quickRg) quickRg.textContent = activeVault.resourceGroup;

  const quickRegion = document.getElementById("vault-quick-region");
  if (quickRegion) quickRegion.textContent = activeVault.location;

  const quickStatus = document.getElementById("vault-quick-status");
  if (quickStatus) {
    quickStatus.textContent = activeVault.status === 'restricted' ? 'Restricted' : 'Accessible';
  }

  const quickStatusDot = document.getElementById("vault-quick-status-dot");
  if (quickStatusDot) {
    quickStatusDot.className = `status-dot ${activeVault.status === 'restricted' ? 'restricted' : 'accessible'}`;
  }

  const quickStatusChip = document.getElementById("vault-quick-status-chip");
  if (quickStatusChip) {
    if (activeVault.status === 'restricted') {
      quickStatusChip.style.background = "rgba(245, 158, 11, 0.08)";
      quickStatusChip.style.borderColor = "rgba(245, 158, 11, 0.25)";
      quickStatusChip.style.color = "#fbbf24";
    } else {
      quickStatusChip.style.background = "rgba(16, 185, 129, 0.08)";
      quickStatusChip.style.borderColor = "rgba(16, 185, 129, 0.2)";
      quickStatusChip.style.color = "#34d399";
    }
  }

  // 3. Render Custom Dropdown Menu Options
  const countTag = document.getElementById("vault-dropdown-count");
  if (countTag) {
    countTag.textContent = `${ENUMERATION_DATA.vaults.length} vaults`;
  }

  const optionsContainer = document.getElementById("vault-dropdown-options");
  if (optionsContainer) {
    optionsContainer.innerHTML = "";
    const filterLower = (filterText || "").trim().toLowerCase();

    const filteredVaults = ENUMERATION_DATA.vaults.filter(v => 
      !filterLower || 
      v.name.toLowerCase().includes(filterLower) ||
      v.resourceGroup.toLowerCase().includes(filterLower) ||
      v.location.toLowerCase().includes(filterLower)
    );

    if (filteredVaults.length === 0) {
      optionsContainer.innerHTML = `
        <div class="vault-dropdown-empty">
          No key vaults match "${escapeHtml(filterText)}"
        </div>
      `;
    } else {
      filteredVaults.forEach(v => {
        const isSelected = v.id === currentVaultId;
        const isRestricted = v.status === "restricted";
        const item = document.createElement("div");
        item.className = `vault-dropdown-item ${isSelected ? 'selected' : ''}`;
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", isSelected ? "true" : "false");
        item.setAttribute("tabindex", "0");
        
        item.onclick = (e) => {
          e.stopPropagation();
          selectVault(v.id);
        };

        item.onkeydown = (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectVault(v.id);
          }
        };

        item.innerHTML = `
          <div class="vault-item-left">
            <span class="status-dot ${isRestricted ? 'restricted' : 'accessible'}"></span>
            <div class="vault-item-info">
              <span class="vault-item-name font-mono">${escapeHtml(v.name)}</span>
              <span class="vault-item-sub">${escapeHtml(v.resourceGroup)} • ${escapeHtml(v.location)}</span>
            </div>
          </div>
          <div class="vault-item-right">
            <span class="vault-item-badge">${v.secrets.length} secrets</span>
            ${isSelected ? `
              <svg class="vault-item-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ` : ''}
          </div>
        `;
        optionsContainer.appendChild(item);
      });
    }
  }

  // 4. Update Native Select Fallback
  const nativeSelect = document.getElementById("vault-dropdown-select");
  if (nativeSelect) {
    nativeSelect.innerHTML = "";
    ENUMERATION_DATA.vaults.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.id;
      opt.textContent = `${v.name} (${v.secrets.length} secrets - ${v.resourceGroup})`;
      if (v.id === currentVaultId) opt.selected = true;
      nativeSelect.appendChild(opt);
    });
  }

  // 5. Fallback for legacy pill buttons if still in DOM
  const container = document.getElementById("vault-switcher-pills");
  if (container) {
    container.innerHTML = "";
    ENUMERATION_DATA.vaults.forEach(v => {
      const pill = document.createElement("button");
      pill.className = `vault-pill ${v.id === currentVaultId ? 'active' : ''}`;
      pill.onclick = () => selectVault(v.id);

      const isRestricted = v.status === "restricted";
      const statusDot = `<span class="status-dot ${isRestricted ? 'restricted' : 'accessible'}"></span>`;

      pill.innerHTML = `
        ${statusDot}
        <span>${v.name}</span>
        <span style="font-size: 0.68rem; color: var(--text-muted);">(${v.secrets.length} secrets)</span>
      `;
      container.appendChild(pill);
    });
  }
}

// ============================================================================
// RESOURCE GROUPS VIEW & DROPDOWN LOGIC
// ============================================================================

function syncBackendResourceGroups(backendGroups, backendResources) {
  if (!Array.isArray(backendGroups)) return;
  if (backendGroups.length === 0) {
    ENUMERATION_DATA.resourceGroups = [];
    const countAllGroups = document.getElementById("count-all-groups");
    if (countAllGroups) countAllGroups.textContent = "0";
    return;
  }
  
  const mappedGroups = backendGroups.map(bg => {
    const groupResources = (backendResources || []).filter(r => {
      if (!r.id) return false;
      const idLower = r.id.toLowerCase();
      const nameLower = bg.name.toLowerCase();
      return idLower.includes(`/resourcegroups/${nameLower}/`) || idLower.endsWith(`/resourcegroups/${nameLower}`);
    });

    const items = groupResources.map(res => {
      let category = "other";
      const typeLower = (res.type || "").toLowerCase();
      if (typeLower.includes("keyvault")) category = "keyvault";
      else if (typeLower.includes("compute") || typeLower.includes("web") || typeLower.includes("virtualmachine")) category = "compute";
      else if (typeLower.includes("storage") || typeLower.includes("sql") || typeLower.includes("database")) category = "storage";
      else if (typeLower.includes("network")) category = "network";

      return {
        name: res.name || "Resource",
        type: res.type || "Microsoft.Resources",
        category: category,
        location: res.location || bg.location || "East US",
        status: "Online",
        id: res.id
      };
    });

    const kvNames = items.filter(i => i.category === "keyvault").map(i => i.name);

    return {
      id: bg.id,
      name: bg.name,
      location: bg.location || "East US",
      status: "Healthy",
      provisioningState: bg.provisioningState || (bg.properties && bg.properties.provisioningState) || "Succeeded",
      tags: bg.tags || {},
      keyVaults: kvNames,
      resources: items.length,
      items: items
    };
  });

  ENUMERATION_DATA.resourceGroups = mappedGroups;
  const navRgCount = document.getElementById("nav-rg-count");
  if (navRgCount) navRgCount.textContent = mappedGroups.length;

  const countAllGroups = document.getElementById("count-all-groups");
  if (countAllGroups) countAllGroups.textContent = mappedGroups.length;

  if (Boolean(document.getElementById("view-resource-groups"))) {
    if (!mappedGroups.some(g => g.name === currentRgName)) {
      currentRgName = mappedGroups[0].name;
    }
    renderRgDropdown();
    renderActiveResourceGroup();
  }
}
window.syncBackendResourceGroups = syncBackendResourceGroups;

function selectRgAndSwitchTab(rgName) {
  selectResourceGroup(rgName);
  const resTabBtn = document.querySelector('.tab-btn[data-tab="resources"]');
  if (resTabBtn) {
    resTabBtn.click();
  }
}
window.selectRgAndSwitchTab = selectRgAndSwitchTab;

function filterRgGroupsTable(query) {
  const tbody = document.getElementById("rg-groups-tbody");
  if (!tbody) return;
  const q = (query || "").toLowerCase().trim();
  const rows = tbody.querySelectorAll("tr");
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(q) ? "" : "none";
  });
}
window.filterRgGroupsTable = filterRgGroupsTable;

function exportAllGroupsJson() {
  const data = window._serverGroupsData || ENUMERATION_DATA.resourceGroups || [];
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const a = document.createElement("a");
  a.setAttribute("href", dataStr);
  a.setAttribute("download", "azure_resource_groups.json");
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast("Exported resource groups to JSON");
}
window.exportAllGroupsJson = exportAllGroupsJson;

function getActiveResourceGroup() {
  return ENUMERATION_DATA.resourceGroups.find(rg => rg.name === currentRgName) || ENUMERATION_DATA.resourceGroups[0];
}

function selectResourceGroup(rgName) {
  currentRgName = rgName;
  try {
    localStorage.setItem("az_selected_rg", rgName);
  } catch (e) {}

  closeRgDropdown();
  renderRgDropdown();
  renderActiveResourceGroup();

  const breadcrumbCurrent = document.getElementById("breadcrumb-current-view");
  if (breadcrumbCurrent && (currentView === "resource-groups" || Boolean(document.getElementById("view-resource-groups")))) {
    const rg = getActiveResourceGroup();
    breadcrumbCurrent.textContent = `Resource Groups // ${rg.name}`;
  }
}

function selectRgAndNavigate(rgName) {
  selectResourceGroup(rgName);
  const hasRgView = Boolean(document.getElementById("view-resource-groups"));
  if (!hasRgView) {
    window.location.href = getResourceGroupsUrl();
  } else {
    navigateTo("resource-groups");
  }
}

function openRgDropdown() {
  const dd = document.getElementById("rg-dropdown");
  const toggle = document.getElementById("rg-dropdown-toggle");
  if (!dd || !toggle) return;
  dd.classList.add("open");
  toggle.setAttribute("aria-expanded", "true");
  const searchInput = document.getElementById("rg-dropdown-search-input");
  if (searchInput) {
    searchInput.focus();
  }
}

function closeRgDropdown() {
  const dd = document.getElementById("rg-dropdown");
  const toggle = document.getElementById("rg-dropdown-toggle");
  if (!dd) return;
  dd.classList.remove("open");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
  const searchInput = document.getElementById("rg-dropdown-search-input");
  if (searchInput && searchInput.value) {
    searchInput.value = "";
    renderRgDropdown("");
  }
}

function toggleRgDropdown(e) {
  if (e) {
    e.preventDefault();
    if (typeof e.stopImmediatePropagation === "function") {
      e.stopImmediatePropagation();
    } else {
      e.stopPropagation();
    }
  }
  const dd = document.getElementById("rg-dropdown");
  if (!dd) return;
  if (dd.classList.contains("open")) {
    closeRgDropdown();
  } else {
    openRgDropdown();
  }
}
window.toggleRgDropdown = toggleRgDropdown;
window.openRgDropdown = openRgDropdown;
window.closeRgDropdown = closeRgDropdown;
window.selectResourceGroup = selectResourceGroup;
window.selectRgAndNavigate = selectRgAndNavigate;
window.filterRgResources = filterRgResources;
window.copyRgResourceId = copyRgResourceId;
window.exportRgResourcesJson = exportRgResourcesJson;

function renderRgDropdown(filterText = "") {
  const activeRg = getActiveResourceGroup();

  // 1. Update Dropdown Toggle Button
  const toggleName = document.getElementById("rg-dd-selected-name");
  if (toggleName) toggleName.textContent = activeRg.name;

  const toggleBadge = document.getElementById("rg-dd-selected-badge");
  const totalCount = activeRg.items ? activeRg.items.length : activeRg.resources;
  if (toggleBadge) toggleBadge.textContent = `${totalCount} resources`;

  const toggleDot = document.getElementById("rg-dd-status-dot");
  if (toggleDot) {
    toggleDot.className = `status-dot ${activeRg.status === 'Restricted' ? 'restricted' : 'accessible'}`;
  }

  // 2. Update Top Bar Quick Context Badges
  const quickLoc = document.getElementById("rg-quick-location");
  if (quickLoc) quickLoc.textContent = activeRg.location;

  const quickCount = document.getElementById("rg-quick-count");
  if (quickCount) quickCount.textContent = `${totalCount} Resources`;

  const quickStatus = document.getElementById("rg-quick-status");
  if (quickStatus) quickStatus.textContent = activeRg.status;

  const quickStatusDot = document.getElementById("rg-quick-status-dot");
  if (quickStatusDot) {
    quickStatusDot.className = `status-dot ${activeRg.status === 'Restricted' ? 'restricted' : 'accessible'}`;
  }

  const quickStatusChip = document.getElementById("rg-quick-status-chip");
  if (quickStatusChip) {
    if (activeRg.status === 'Restricted') {
      quickStatusChip.style.background = "rgba(245, 158, 11, 0.08)";
      quickStatusChip.style.borderColor = "rgba(245, 158, 11, 0.25)";
      quickStatusChip.style.color = "#fbbf24";
    } else {
      quickStatusChip.style.background = "rgba(16, 185, 129, 0.08)";
      quickStatusChip.style.borderColor = "rgba(16, 185, 129, 0.2)";
      quickStatusChip.style.color = "#34d399";
    }
  }

  // 3. Render Custom Dropdown Menu Options
  const countTag = document.getElementById("rg-dropdown-count");
  if (countTag) {
    countTag.textContent = `${ENUMERATION_DATA.resourceGroups.length} groups`;
  }

  const optionsContainer = document.getElementById("rg-dropdown-options");
  if (optionsContainer) {
    optionsContainer.innerHTML = "";
    const filterLower = (filterText || "").trim().toLowerCase();

    const filteredRgs = ENUMERATION_DATA.resourceGroups.filter(rg =>
      !filterLower ||
      rg.name.toLowerCase().includes(filterLower) ||
      rg.location.toLowerCase().includes(filterLower) ||
      (rg.status && rg.status.toLowerCase().includes(filterLower))
    );

    if (filteredRgs.length === 0) {
      optionsContainer.innerHTML = `
        <div class="vault-dropdown-empty">
          No resource groups match "${escapeHtml(filterText)}"
        </div>
      `;
    } else {
      filteredRgs.forEach(rg => {
        const isSelected = rg.name === currentRgName;
        const isRestricted = rg.status === "Restricted";
        const resCount = rg.items ? rg.items.length : rg.resources;
        const item = document.createElement("div");
        item.className = `vault-dropdown-item ${isSelected ? 'selected' : ''}`;
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", isSelected ? "true" : "false");
        item.setAttribute("tabindex", "0");

        item.onclick = (e) => {
          e.stopPropagation();
          selectResourceGroup(rg.name);
        };

        item.onkeydown = (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectResourceGroup(rg.name);
          }
        };

        item.innerHTML = `
          <div class="vault-item-left">
            <span class="status-dot ${isRestricted ? 'restricted' : 'accessible'}"></span>
            <div class="vault-item-info">
              <span class="vault-item-name font-mono">${escapeHtml(rg.name)}</span>
              <span class="vault-item-sub">${escapeHtml(rg.location)} • ${rg.status}</span>
            </div>
          </div>
          <div class="vault-item-right">
            <span class="vault-item-badge">${resCount} resources</span>
            ${isSelected ? `
              <svg class="vault-item-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ` : ''}
          </div>
        `;
        optionsContainer.appendChild(item);
      });
    }
  }

  // 4. Update Native Select Fallback
  const nativeSelect = document.getElementById("rg-dropdown-select");
  if (nativeSelect) {
    nativeSelect.innerHTML = "";
    ENUMERATION_DATA.resourceGroups.forEach(rg => {
      const opt = document.createElement("option");
      opt.value = rg.name;
      opt.textContent = `${rg.name} (${(rg.items ? rg.items.length : rg.resources)} resources - ${rg.location})`;
      if (rg.name === currentRgName) opt.selected = true;
      nativeSelect.appendChild(opt);
    });
  }
}

function renderActiveResourceGroup() {
  const rg = getActiveResourceGroup();

  // Header Details
  const titleEl = document.getElementById("rg-detail-title");
  if (titleEl) titleEl.textContent = rg.name;

  const resIdText = document.getElementById("rg-res-id-text");
  if (resIdText) resIdText.textContent = rg.id;

  const resIdBox = document.getElementById("rg-res-id-box");
  if (resIdBox) resIdBox.setAttribute("data-uri", rg.id);

  // Config Tags
  const configTagsEl = document.getElementById("rg-config-tags");
  if (configTagsEl) {
    configTagsEl.innerHTML = `
      <span class="tag tag-cyan">
        Location: ${rg.location}
      </span>
      <span class="tag tag-neutral">
        Provisioning: ${rg.provisioningState || 'Succeeded'}
      </span>
      <span class="tag ${rg.status === 'Restricted' ? 'tag-warning' : 'tag-neutral'}">
        Security Scope: ${rg.status}
      </span>
      ${rg.keyVaults && rg.keyVaults.length > 0 ? `
        <span class="tag tag-indigo" style="cursor: pointer;" onclick="selectVaultAndNavigate('${rg.keyVaults[0]}')">
          Key Vault: ${rg.keyVaults.join(', ')} →
        </span>
      ` : ''}
    `;
  }

  // Count Badges
  const items = rg.items || [];
  const countAll = document.getElementById("count-rg-all");
  if (countAll) countAll.textContent = items.length;
  const pillAll = document.getElementById("pill-count-all");
  if (pillAll) pillAll.textContent = items.length;

  const countVaults = document.getElementById("count-rg-vaults");
  const vaultItems = items.filter(r => r.category === 'keyvault' || r.type.includes('KeyVault'));
  if (countVaults) countVaults.textContent = vaultItems.length;
  const pillVaults = document.getElementById("pill-count-vaults");
  if (pillVaults) pillVaults.textContent = vaultItems.length;

  const countCompute = document.getElementById("count-rg-compute");
  const computeItems = items.filter(r => r.category === 'compute' || r.type.includes('Compute') || r.type.includes('Web') || r.type.includes('ContainerService'));
  if (countCompute) countCompute.textContent = computeItems.length;
  const pillCompute = document.getElementById("pill-count-compute");
  if (pillCompute) pillCompute.textContent = computeItems.length;

  const countStorage = document.getElementById("count-rg-storage");
  const storageItems = items.filter(r => r.category === 'storage' || r.type.includes('Storage') || r.type.includes('Sql'));
  if (countStorage) countStorage.textContent = storageItems.length;
  const pillStorage = document.getElementById("pill-count-storage");
  if (pillStorage) pillStorage.textContent = storageItems.length;

  const countNetwork = document.getElementById("count-rg-network");
  const networkItems = items.filter(r => r.category === 'network' || r.type.includes('Network'));
  if (countNetwork) countNetwork.textContent = networkItems.length;
  const pillNetwork = document.getElementById("pill-count-network");
  if (pillNetwork) pillNetwork.textContent = networkItems.length;

  const searchInput = document.getElementById("rg-resource-search-input");
  const filterVal = searchInput ? searchInput.value : "";
  renderRgResourcesTable(items, filterVal, activeRgCategoryFilter);
}

function getResourceIcon(type, category) {
  if (category === "keyvault" || type.includes("KeyVault")) {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-cyan); flex-shrink: 0;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
  }
  if (category === "compute" || type.includes("Compute") || type.includes("virtualMachines")) {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-indigo); flex-shrink: 0;"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`;
  }
  if (category === "storage" || type.includes("Storage") || type.includes("Sql")) {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-amber); flex-shrink: 0;"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`;
  }
  if (category === "network" || type.includes("Network")) {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-violet); flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
  }
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-blue); flex-shrink: 0;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`;
}

function renderRgResourcesTable(items, searchFilter = "", categoryFilter = "all") {
  const tbody = document.getElementById("rg-resources-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const filterLower = (searchFilter || "").trim().toLowerCase();

  const filtered = items.filter(r => {
    // Category filter
    if (categoryFilter !== "all") {
      if (categoryFilter === "keyvault" && !(r.category === "keyvault" || r.type.includes("KeyVault"))) return false;
      if (categoryFilter === "compute" && !(r.category === "compute" || r.type.includes("Compute") || r.type.includes("Web") || r.type.includes("ContainerService"))) return false;
      if (categoryFilter === "storage" && !(r.category === "storage" || r.type.includes("Storage") || r.type.includes("Sql"))) return false;
      if (categoryFilter === "network" && !(r.category === "network" || r.type.includes("Network"))) return false;
    }
    // Search text filter
    if (filterLower) {
      return (
        r.name.toLowerCase().includes(filterLower) ||
        r.type.toLowerCase().includes(filterLower) ||
        r.location.toLowerCase().includes(filterLower) ||
        r.status.toLowerCase().includes(filterLower)
      );
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">No resources found matching current criteria</td></tr>`;
    return;
  }

  filtered.forEach(res => {
    const isKeyVault = res.category === "keyvault" || res.type.includes("KeyVault");
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <span class="resource-name-cell">
          ${getResourceIcon(res.type, res.category)}
          ${escapeHtml(res.name)}
        </span>
      </td>
      <td>
        <span class="badge-tag">${escapeHtml(res.type)}</span>
      </td>
      <td>
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">${escapeHtml(res.location)}</span>
      </td>
      <td>
        <span class="tag ${res.status.toLowerCase().includes('running') || res.status.toLowerCase().includes('active') || res.status.toLowerCase().includes('accessible') || res.status.toLowerCase().includes('online') ? 'tag-cyan' : 'tag-neutral'}">
          ${escapeHtml(res.status)}
        </span>
      </td>
      <td>
        <button class="action-btn-sm" onclick="copyText('${escapeHtml(res.id || res.name)}', 'Resource ID copied')">
          Copy ID
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterRgResources(category) {
  activeRgCategoryFilter = category;
  document.querySelectorAll("[data-rg-filter]").forEach(btn => {
    if (btn.getAttribute("data-rg-filter") === category) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const activeRg = getActiveResourceGroup();
  const searchInput = document.getElementById("rg-resource-search-input");
  const filterVal = searchInput ? searchInput.value : "";
  renderRgResourcesTable(activeRg.items || [], filterVal, activeRgCategoryFilter);
}

function copyRgResourceId() {
  const rg = getActiveResourceGroup();
  navigator.clipboard.writeText(rg.id).then(() => {
    showToast("Resource Group ID copied to clipboard");
  });
}

function copyText(val, msg = "Copied to clipboard") {
  navigator.clipboard.writeText(val).then(() => {
    showToast(msg);
  });
}

function exportRgResourcesJson() {
  const rg = getActiveResourceGroup();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rg, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${rg.name}_resources.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast(`Exported ${rg.name} resources to JSON`);
}

// Render Dashboard Homepage Data
function renderDashboard() {
  const { resourceGroups, reconTimeline, vaults } = ENUMERATION_DATA;

  // Compute Metrics
  let totalSecrets = 0;
  let totalKeys = 0;
  let totalCerts = 0;

  vaults.forEach(v => {
    totalSecrets += v.secrets.length;
    totalKeys += v.keys.length;
    totalCerts += v.certificates.length;
  });

  const dashStatVaults = document.getElementById("dash-stat-vaults");
  if (dashStatVaults) dashStatVaults.textContent = vaults.length;

  const dashStatSecrets = document.getElementById("dash-stat-secrets");
  if (dashStatSecrets) dashStatSecrets.textContent = totalSecrets;

  const dashStatKeys = document.getElementById("dash-stat-keys");
  if (dashStatKeys) dashStatKeys.textContent = totalKeys;

  const dashStatCerts = document.getElementById("dash-stat-certs");
  if (dashStatCerts) dashStatCerts.textContent = totalCerts;

  const navVaultCount = document.getElementById("nav-vault-count");
  if (navVaultCount) navVaultCount.textContent = vaults.length;

  const navRgCount = document.getElementById("nav-rg-count");
  if (navRgCount) navRgCount.textContent = resourceGroups.length;

  const sidebarRgTotal = document.getElementById("sidebar-rg-total");
  if (sidebarRgTotal) sidebarRgTotal.textContent = `${resourceGroups.length} Active`;

  // Render Resource Groups Table
  const rgTbody = document.getElementById("dash-rg-tbody");
  if (rgTbody) {
    rgTbody.innerHTML = "";
    resourceGroups.forEach(rg => {
      const tr = document.createElement("tr");
      const statusClass = rg.status === "Healthy" ? "tag-cyan" : "tag-neutral";

      tr.innerHTML = `
        <td><span class="font-mono" style="font-weight: 600; color: #fff; cursor: pointer;" onclick="selectRgAndNavigate('${rg.name}')" title="Inspect Resource Group Assets">${rg.name} →</span></td>
        <td><span class="tag tag-neutral">${rg.location}</span></td>
        <td style="font-family: var(--font-mono); color: #cbd5e1;">${rg.resources}</td>
        <td>
          ${rg.keyVaults.length > 0 
            ? rg.keyVaults.map(kv => `<span class="tag tag-cyan" style="cursor: pointer;" onclick="selectVaultAndNavigate('${kv}')">${kv}</span>`).join(' ')
            : '<span style="color: var(--text-muted); font-size: 0.775rem;">None</span>'}
        </td>
        <td><span class="tag ${statusClass}">${rg.status}</span></td>
      `;
      rgTbody.appendChild(tr);
    });
  }

  // Render Discovered Vaults Previews (Right Column)
  const previewsContainer = document.getElementById("dash-vault-previews");
  if (previewsContainer) {
    previewsContainer.innerHTML = "";

    vaults.forEach(v => {
      const card = document.createElement("div");
      card.className = "vault-preview-card";
      card.onclick = () => selectVaultAndNavigate(v.id);

      const isRestricted = v.status === "restricted";
      const statusTag = isRestricted 
        ? '<span class="tag tag-warning">Restricted</span>' 
        : '<span class="tag tag-cyan">Accessible</span>';

      card.innerHTML = `
        <div class="vault-preview-top">
          <div class="vault-preview-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            ${v.name}
          </div>
          ${statusTag}
        </div>
        <div class="vault-preview-metrics">
          <span>${v.secrets.length} Secrets</span>
          <span>${v.keys.length} Keys</span>
          <span>${v.certificates.length} Certs</span>
        </div>
        <div class="vault-preview-footer">
          <span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.7rem;">${v.resourceGroup}</span>
          <span class="vault-preview-action">Inspect Vault →</span>
        </div>
      `;
      previewsContainer.appendChild(card);
    });
  }

  // Render Recon Timeline
  const timelineList = document.getElementById("dash-timeline-list");
  if (timelineList) {
    timelineList.innerHTML = "";

    reconTimeline.forEach(item => {
      const li = document.createElement("li");
      li.className = "timeline-item";
      li.innerHTML = `
        <span class="timeline-marker"></span>
        <div class="timeline-content">
          <span class="timeline-time">${item.time}</span>
          <span class="timeline-text">${item.event}</span>
        </div>
      `;
      timelineList.appendChild(li);
    });
  }
}

// Render Sidebar Resource Groups List
function renderSidebar() {
  const rgListEl = document.getElementById("sidebar-rg-list");
  if (!rgListEl) return;
  rgListEl.innerHTML = "";

  ENUMERATION_DATA.resourceGroups.forEach(rg => {
    const li = document.createElement("li");
    li.className = "sidebar-rg-item";
    li.onclick = () => {
      selectRgAndNavigate(rg.name);
    };
    const resCount = rg.items ? rg.items.length : rg.resources;
    li.setAttribute("title", `${rg.name} (${resCount} resources, ${rg.location})`);

    li.innerHTML = `
      <div class="sidebar-rg-item-left">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--text-muted); flex-shrink: 0;">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <span class="sidebar-rg-name">${rg.name}</span>
      </div>
      <span class="sidebar-rg-region">${rg.resources} res</span>
    `;
    rgListEl.appendChild(li);
  });
}

// Render Active Vault in View 2
function renderActiveVault() {
  const vault = getActiveVault();
  
  // Header details
  const vaultTitle = document.getElementById("vault-title");
  if (vaultTitle) vaultTitle.textContent = vault.name;

  const vaultUriText = document.getElementById("vault-uri-text");
  if (vaultUriText) vaultUriText.textContent = vault.uri;

  const vaultUriBox = document.getElementById("vault-uri-box");
  if (vaultUriBox) vaultUriBox.setAttribute("data-uri", vault.uri);
  
  // Config Tags
  const configTagsEl = document.getElementById("config-tags");
  if (configTagsEl) {
    configTagsEl.innerHTML = `
      <span class="tag tag-neutral">
        Auth: ${vault.rbacAuth ? 'Azure RBAC' : 'Vault Access Policies'}
      </span>
      <span class="tag ${vault.softDelete.includes('Disabled') ? 'tag-warning' : 'tag-cyan'}">
        Soft Delete: ${vault.softDelete}
      </span>
      <span class="tag ${vault.purgeProtection === 'Enabled' ? 'tag-cyan' : 'tag-neutral'}">
        Purge Protection: ${vault.purgeProtection}
      </span>
      <span class="tag tag-neutral">
        Network: ${vault.publicNetwork}
      </span>
    `;
  }

  // Tab Counts
  const countSecrets = document.getElementById("count-secrets");
  if (countSecrets) countSecrets.textContent = vault.secrets.length;

  const countKeys = document.getElementById("count-keys");
  if (countKeys) countKeys.textContent = vault.keys.length;

  const countCerts = document.getElementById("count-certs");
  if (countCerts) countCerts.textContent = vault.certificates.length;

  renderSecretsTable(vault.secrets);
  renderKeysTable(vault.keys);
  renderCertsTable(vault.certificates);
}

function renderSecretsTable(secrets, searchFilter = "") {
  const tbody = document.getElementById("secrets-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const filtered = secrets.filter(s => 
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.contentType.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No secrets found</td></tr>`;
    return;
  }

  filtered.forEach((secret, index) => {
    const isError = secret.value.startsWith("[403");
    const tr = document.createElement("tr");
    
    tr.innerHTML = `
      <td>
        <span class="secret-name">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          ${secret.name}
        </span>
      </td>
      <td>
        <div class="secret-value-box">
          <span class="secret-mask" id="mask-${index}" data-val="${escapeHtml(secret.value)}">
            ${isError ? escapeHtml(secret.value) : '••••••••••••••••'}
          </span>
          ${!isError ? `
            <button class="action-icon-btn" onclick="toggleReveal(${index})" title="Reveal/Hide Value">
              <svg id="eye-icon-${index}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button class="action-icon-btn" onclick="copySecret('${escapeHtml(secret.value)}')" title="Copy Value">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          ` : ''}
        </div>
      </td>
      <td><span class="badge-tag">${escapeHtml(secret.contentType || secret.content_type || "secret")}</span></td>
      <td style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.8rem;">${escapeHtml(secret.updated || "N/A")}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderKeysTable(keys) {
  const tbody = document.getElementById("keys-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!keys || keys.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No cryptographic keys discovered</td></tr>`;
    return;
  }

  keys.forEach(k => {
    const tr = document.createElement("tr");
    const opsArr = k.ops || ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
    const statusVal = k.status || (k.enabled_state !== false ? "Enabled" : "Disabled");
    const typeVal = k.type || k.key_type || "RSA";

    tr.innerHTML = `
      <td>
        <span class="key-name">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="15.5" r="5.5"></circle><path d="m21 2-9.6 9.6"></path><path d="m15.5 7.5 3 3"></path></svg>
          ${escapeHtml(k.name)}
        </span>
      </td>
      <td><span style="font-family: var(--font-mono); color: #cbd5e1;">${escapeHtml(typeVal)}</span></td>
      <td>
        <div style="display: flex; gap: 0.3rem; flex-wrap: wrap;">
          ${opsArr.map(op => `<span class="tag tag-neutral">${escapeHtml(op)}</span>`).join('')}
        </div>
      </td>
      <td><span class="tag ${statusVal === 'Enabled' ? 'tag-cyan' : 'tag-neutral'}">${escapeHtml(statusVal)}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderCertsTable(certs) {
  const tbody = document.getElementById("certs-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!certs || certs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No SSL/TLS certificates discovered</td></tr>`;
    return;
  }

  certs.forEach(c => {
    const tr = document.createElement("tr");
    const autoRenewVal = c.autoRenew || (c.enabled_state !== false ? "Enabled" : "Disabled");
    tr.innerHTML = `
      <td>
        <span class="cert-name">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          ${escapeHtml(c.name)}
        </span>
      </td>
      <td><span style="font-family: var(--font-mono); font-size: 0.775rem; color: var(--text-secondary);">${escapeHtml(c.thumbprint || "N/A")}</span></td>
      <td style="font-family: var(--font-mono); font-size: 0.8rem; color: #cbd5e1;">${escapeHtml(c.expires || "Active")}</td>
      <td><span class="tag ${autoRenewVal === 'Enabled' ? 'tag-cyan' : 'tag-neutral'}">${escapeHtml(autoRenewVal)}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleReveal(index) {
  const el = document.getElementById(`mask-${index}`);
  if (!el) return;
  const isRevealed = el.classList.contains("secret-revealed");
  
  if (isRevealed) {
    el.textContent = "••••••••••••••••";
    el.classList.remove("secret-revealed");
  } else {
    el.textContent = el.getAttribute("data-val");
    el.classList.add("secret-revealed");
  }
}

function copySecret(val) {
  navigator.clipboard.writeText(val).then(() => {
    showToast("Secret value copied to clipboard");
  }).catch(() => {
    showToast("Failed to copy secret");
  });
}

function copyUri() {
  const vault = getActiveVault();
  navigator.clipboard.writeText(vault.uri).then(() => {
    showToast("Vault URI copied to clipboard");
  });
}

function copyTenantId() {
  const el = document.getElementById("dash-tenant-id") || document.getElementById("sidebar-tenant-id-short");
  const val = (el ? el.textContent.trim() : "") || ENUMERATION_DATA.tenant.tenantId;
  navigator.clipboard.writeText(val).then(() => {
    showToast(`Tenant ID copied: ${val}`);
  });
}

function copySubscriptionId() {
  const el = document.getElementById("dash-sub-id") || document.getElementById("top-sub-id");
  const val = (el ? el.textContent.trim() : "") || ENUMERATION_DATA.subscription.subscriptionId;
  navigator.clipboard.writeText(val).then(() => {
    showToast(`Subscription ID copied: ${val}`);
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.querySelector("span").textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function setupEventListeners() {
  // Sidebar Toggle
  const toggleBtn = document.getElementById("sidebar-toggle-btn");
  const sidebar = document.getElementById("app-sidebar");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      const isCollapsed = sidebar.classList.toggle("collapsed");
      localStorage.setItem("az_sidebar_collapsed", isCollapsed ? "true" : "false");
    });

    if (localStorage.getItem("az_sidebar_collapsed") === "true") {
      sidebar.classList.add("collapsed");
    }
  }

  // Table Search
  const secretSearchInput = document.getElementById("secret-search-input");
  if (secretSearchInput) {
    secretSearchInput.addEventListener("input", (e) => {
      const vault = getActiveVault();
      renderSecretsTable(vault.secrets, e.target.value);
    });
  }

  // Tabs in Vaults View
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const tabTarget = btn.getAttribute("data-tab");
      const targetPane = document.getElementById(`tab-${tabTarget}`);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // Key Vault Dropdown Event Listeners
  const vaultDdToggle = document.getElementById("vault-dropdown-toggle");
  if (vaultDdToggle && !vaultDdToggle.onclick) {
    vaultDdToggle.addEventListener("click", toggleVaultDropdown);
  }

  const vaultSearchInput = document.getElementById("vault-dropdown-search-input");
  if (vaultSearchInput) {
    vaultSearchInput.addEventListener("input", (e) => {
      renderVaultSwitcher(e.target.value);
    });
    vaultSearchInput.addEventListener("click", (e) => e.stopPropagation());
    vaultSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeVaultDropdown();
      }
    });
  }

  const nativeSelect = document.getElementById("vault-dropdown-select");
  if (nativeSelect) {
    nativeSelect.addEventListener("change", (e) => {
      selectVault(e.target.value);
    });
  }

  // Resource Group Dropdown Event Listeners
  const rgDdToggle = document.getElementById("rg-dropdown-toggle");
  if (rgDdToggle && !rgDdToggle.onclick) {
    rgDdToggle.addEventListener("click", toggleRgDropdown);
  }

  const rgSearchInput = document.getElementById("rg-dropdown-search-input");
  if (rgSearchInput) {
    rgSearchInput.addEventListener("input", (e) => {
      renderRgDropdown(e.target.value);
    });
    rgSearchInput.addEventListener("click", (e) => e.stopPropagation());
    rgSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeRgDropdown();
      }
    });
  }

  const rgNativeSelect = document.getElementById("rg-dropdown-select");
  if (rgNativeSelect) {
    rgNativeSelect.addEventListener("change", (e) => {
      selectResourceGroup(e.target.value);
    });
  }

  const rgResourceSearch = document.getElementById("rg-resource-search-input");
  if (rgResourceSearch) {
    rgResourceSearch.addEventListener("input", (e) => {
      const activeRg = getActiveResourceGroup();
      renderRgResourcesTable(activeRg.items || [], e.target.value, activeRgCategoryFilter);
    });
  }

  // Close dropdowns when clicking outside or pressing Escape
  document.addEventListener("click", (e) => {
    const vaultDd = document.getElementById("vault-dropdown");
    if (vaultDd && vaultDd.classList.contains("open") && !vaultDd.contains(e.target)) {
      closeVaultDropdown();
    }
    const rgDd = document.getElementById("rg-dropdown");
    if (rgDd && rgDd.classList.contains("open") && !rgDd.contains(e.target)) {
      closeRgDropdown();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeVaultDropdown();
      closeRgDropdown();
    }
  });
}

document.addEventListener("DOMContentLoaded", initApp);
