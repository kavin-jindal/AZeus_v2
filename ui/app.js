// Sample enumeration data representing Azure Tenant, Subscription, and Key Vault discovery output
const ENUMERATION_DATA = {
  tenant: {
    name: "as SecOps Enterprise",
    tenantId: "8a15c13b-199b-426d-a9e3-2e4fa71395b2",
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
    subscriptionId: "7c9e6679-7425-40de-944b-e07db139912e",
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
    { name: "rg-core-services-prod", location: "East US", resources: 14, keyVaults: ["kv-prod-backend-eus"], status: "Healthy" },
    { name: "rg-payment-pci-prod", location: "East US 2", resources: 8, keyVaults: ["kv-payment-service-pci"], status: "Restricted" },
    { name: "rg-sandbox-dev", location: "East US", resources: 6, keyVaults: ["kv-dev-sandbox-eus"], status: "Dev Sandbox" },
    { name: "rg-networking-core", location: "Central US", resources: 12, keyVaults: [], status: "Healthy" }
  ],
  reconTimeline: [
    { time: "12:28:02", event: "Authenticated via Azure CLI token (Subject: pentest-auditor@secops.azure.internal)", alert: false },
    { time: "12:28:05", event: "Resolved Tenant ID: 8a15c13b-199b-426d-a9e3-2e4fa71395b2 (Contoso SecOps)", alert: false },
    { time: "12:28:09", event: "Targeted Subscription: Production-Core-EastUS (7c9e6679-7425-40de-944b-e07db139912e)", alert: false },
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
      resourceId: "/subscriptions/7c9e6679-7425-40de-944b-e07db139912e/resourceGroups/rg-core-services-prod/providers/Microsoft.KeyVault/vaults/kv-prod-backend-eus",
      status: "accessible",
      rbacAuth: true,
      softDelete: "90 Days (Enabled)",
      purgeProtection: "Enabled",
      publicNetwork: "Firewalled",
      secrets: [
        { name: "db-admin-connection-string", value: "Server=tcp:sql-prod-eus.database.windows.net,1433;Initial Catalog=core_db;User ID=az_admin;Password=K9#m$L29!pQx991;", contentType: "connection-string", updated: "2026-03-12" },
        { name: "stripe-api-secret-key", value: "sk_live_51M0abcdef1234567890XYZSECRETTOKEN_PROD", contentType: "api-key", updated: "2026-02-28" },
        { name: "jwt-signing-private-secret", value: "dGhpc19pc19hX3Zlcnlfc2VjdXJlX2p3dF9zaWduaW5nX2tleV8yMDI2", contentType: "jwt-secret", updated: "2026-01-15" },
        { name: "sendgrid-smtp-password", value: "SG.v8912384912aBcDeF.901230-FAKEKEY-TEST-STRING", contentType: "smtp-credentials", updated: "2025-11-20" },
        { name: "redis-cache-primary-key", value: "3s0eR1K98bXq7Lw1Z2v9810a9C82KlM==", contentType: "redis-auth", updated: "2026-04-01" }
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
      resourceId: "/subscriptions/7c9e6679-7425-40de-944b-e07db139912e/resourceGroups/rg-payment-pci-prod/providers/Microsoft.KeyVault/vaults/kv-payment-service-pci",
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
      resourceId: "/subscriptions/7c9e6679-7425-40de-944b-e07db139912e/resourceGroups/rg-sandbox-dev/providers/Microsoft.KeyVault/vaults/kv-dev-sandbox-eus",
      status: "accessible",
      rbacAuth: false,
      softDelete: "Disabled",
      purgeProtection: "Disabled",
      publicNetwork: "Enabled",
      secrets: [
        { name: "dev-mongodb-uri", value: "mongodb://app_dev:Password123!@mongo-dev.internal:27017/sandbox?authSource=admin", contentType: "mongodb-uri", updated: "2026-04-10" },
        { name: "staging-github-pat", value: "ghp_mockToken902183921839abcdefstaging001", contentType: "github-pat", updated: "2026-03-29" },
        { name: "datadog-agent-api-key", value: "d41d8cd98f00b204e9800998ecf8427e", contentType: "api-key", updated: "2026-02-14" }
      ],
      keys: [
        { name: "dev-symmetric-test", type: "oct (256-bit)", status: "Enabled", ops: ["encrypt", "decrypt"], updated: "2026-03-01" }
      ],
      certificates: []
    }
  ]
};

let currentVaultId = ENUMERATION_DATA.vaults[0].id;
let currentView = "dashboard";

function getDashboardUrl() {
  if (window.location.pathname.endsWith(".html")) return "index.html";
  return "/home";
}

function getKeyVaultUrl() {
  if (window.location.pathname.endsWith(".html")) return "keyvault.html";
  return "/keyvault";
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
  const isKeyVaultOnly = hasVaultsView && !hasDashboardView;
  const isDashboardOnly = hasDashboardView && !hasVaultsView;

  // Restore active vault from localStorage if valid
  try {
    const savedVault = localStorage.getItem("az_selected_vault");
    if (savedVault && ENUMERATION_DATA.vaults.some(v => v.id === savedVault)) {
      currentVaultId = savedVault;
    }
  } catch (e) {}

  // Render shared framework elements
  renderSidebar();
  renderHeaderAndSidebarInfo();

  if (isKeyVaultOnly) {
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
  } else if (isDashboardOnly) {
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
  const isKeyVaultOnly = hasVaultsView && !hasDashboardView;
  const isDashboardOnly = hasDashboardView && !hasVaultsView;

  const navDashboardBtn = document.getElementById("nav-btn-dashboard");
  const navTenantBtn = document.getElementById("nav-btn-tenant");
  const navRgsBtn = document.getElementById("nav-btn-rgs");
  const navVaultsBtn = document.getElementById("nav-btn-vaults");
  const viewDashboard = document.getElementById("view-dashboard");
  const viewVaults = document.getElementById("view-vaults");
  const breadcrumbCurrent = document.getElementById("breadcrumb-current-view");

  if (viewName === "vaults") {
    if (isDashboardOnly) {
      window.location.href = getKeyVaultUrl();
      return;
    }
    [navDashboardBtn, navTenantBtn, navRgsBtn].forEach(b => b && b.classList.remove("active"));
    if (navVaultsBtn) navVaultsBtn.classList.add("active");
    if (viewVaults) viewVaults.classList.add("active");
    if (viewDashboard) viewDashboard.classList.remove("active");
    const vault = getActiveVault();
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = `Key Vaults // ${vault.name}`;
    renderVaultSwitcher();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (viewName === "dashboard") {
    if (isKeyVaultOnly) {
      window.location.href = getDashboardUrl();
      return;
    }
    [navTenantBtn, navRgsBtn, navVaultsBtn].forEach(b => b && b.classList.remove("active"));
    if (navDashboardBtn) navDashboardBtn.classList.add("active");
    if (viewDashboard) viewDashboard.classList.add("active");
    if (viewVaults) viewVaults.classList.remove("active");
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Dashboard Overview";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (viewName === "tenant") {
    if (isKeyVaultOnly) {
      window.location.href = `${getDashboardUrl()}#section-tenant-overview`;
      return;
    }
    [navDashboardBtn, navRgsBtn, navVaultsBtn].forEach(b => b && b.classList.remove("active"));
    if (navTenantBtn) navTenantBtn.classList.add("active");
    if (viewDashboard) viewDashboard.classList.add("active");
    if (viewVaults) viewVaults.classList.remove("active");
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Tenant & Directory Options";
    const tenantSec = document.getElementById("section-tenant-overview");
    if (tenantSec) tenantSec.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (viewName === "resource-groups") {
    if (isKeyVaultOnly) {
      window.location.href = `${getDashboardUrl()}#section-resource-groups`;
      return;
    }
    [navDashboardBtn, navTenantBtn, navVaultsBtn].forEach(b => b && b.classList.remove("active"));
    if (navRgsBtn) navRgsBtn.classList.add("active");
    if (viewDashboard) viewDashboard.classList.add("active");
    if (viewVaults) viewVaults.classList.remove("active");
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Discovered Resource Groups";
    const rgSec = document.getElementById("section-resource-groups");
    if (rgSec) rgSec.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function selectVault(vaultId) {
  currentVaultId = vaultId;
  try {
    localStorage.setItem("az_selected_vault", vaultId);
  } catch (e) {}

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

// In-view Vault Switcher Pills on Key Vaults Page
function renderVaultSwitcher() {
  const container = document.getElementById("vault-switcher-pills");
  if (!container) return;
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
        <td><span class="font-mono" style="font-weight: 600; color: #fff;">${rg.name}</span></td>
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
      if (rg.keyVaults.length > 0) {
        selectVaultAndNavigate(rg.keyVaults[0]);
      } else {
        navigateTo("resource-groups");
      }
    };
    li.setAttribute("title", `${rg.name} (${rg.resources} resources, ${rg.location})`);

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
      <td><span class="badge-tag">${secret.contentType}</span></td>
      <td style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.8rem;">${secret.updated}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderKeysTable(keys) {
  const tbody = document.getElementById("keys-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (keys.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No cryptographic keys discovered</td></tr>`;
    return;
  }

  keys.forEach(k => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <span class="key-name">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="15.5" r="5.5"></circle><path d="m21 2-9.6 9.6"></path><path d="m15.5 7.5 3 3"></path></svg>
          ${k.name}
        </span>
      </td>
      <td><span style="font-family: var(--font-mono); color: #cbd5e1;">${k.type}</span></td>
      <td>
        <div style="display: flex; gap: 0.3rem; flex-wrap: wrap;">
          ${k.ops.map(op => `<span class="tag tag-neutral">${op}</span>`).join('')}
        </div>
      </td>
      <td><span class="tag tag-cyan">${k.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderCertsTable(certs) {
  const tbody = document.getElementById("certs-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (certs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No SSL/TLS certificates discovered</td></tr>`;
    return;
  }

  certs.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <span class="cert-name">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          ${c.name}
        </span>
      </td>
      <td><span style="font-family: var(--font-mono); font-size: 0.775rem; color: var(--text-secondary);">${c.thumbprint}</span></td>
      <td style="font-family: var(--font-mono); font-size: 0.8rem; color: #cbd5e1;">${c.expires}</td>
      <td><span class="tag tag-neutral">${c.autoRenew}</span></td>
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
}

document.addEventListener("DOMContentLoaded", initApp);
