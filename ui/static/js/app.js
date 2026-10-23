// Dynamic enumeration data representing Azure Tenant, Subscription, and Key Vault discovery output
const ENUMERATION_DATA = {
  tenant: {
    name: "",
    tenantId: "",
    primaryDomain: "",
    directoryType: "Microsoft Entra ID",
    country: "",
    cloudEnvironment: "AzureCloud",
    authMethod: "Azure CLI (az login OAuth2)",
    account: "",
    accountRoles: ""
  },
  subscription: {
    displayName: "",
    subscriptionId: "",
    state: "Active",
    spendingLimit: "",
    managementGroup: "",
    region: "",
    resourceGroupCount: 0,
    tags: {}
  },
  resourceGroups: [],
  reconTimeline: [],
  vaults: []
};

let currentVaultId = null;
let currentRgName = null;
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

  // Check if pending data from server template was queued before app.js loaded
  if (window._pendingDashboardData && typeof window.syncDashboardData === "function") {
    window.syncDashboardData(window._pendingDashboardData);
    delete window._pendingDashboardData;
  }

  // Restore active vault & RG from localStorage if valid
  try {
    const savedVault = localStorage.getItem("az_selected_vault");
    if (savedVault && ENUMERATION_DATA.vaults.some(v => v.id === savedVault)) {
      currentVaultId = savedVault;
    } else if (ENUMERATION_DATA.vaults.length > 0) {
      currentVaultId = ENUMERATION_DATA.vaults[0].id;
    }
    const savedRg = localStorage.getItem("az_selected_rg");
    if (savedRg && ENUMERATION_DATA.resourceGroups.some(rg => rg.name === savedRg)) {
      currentRgName = savedRg;
    } else if (ENUMERATION_DATA.resourceGroups.length > 0) {
      currentRgName = ENUMERATION_DATA.resourceGroups[0].name;
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
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = rg ? `Resource Groups // ${rg.name}` : `Resource Groups`;

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
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = vault ? `Key Vaults // ${vault.name}` : `Key Vaults`;

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

  // If no dynamic data is loaded yet, fetch from overview API
  if (ENUMERATION_DATA.vaults.length === 0 && ENUMERATION_DATA.resourceGroups.length === 0) {
    fetch("/api/overview")
      .then(res => res.json())
      .then(data => {
        if (data && data.success && typeof window.syncDashboardData === "function") {
          window.syncDashboardData(data);
        }
      })
      .catch(() => {});
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
  if (!ENUMERATION_DATA.vaults || ENUMERATION_DATA.vaults.length === 0) return null;
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
  if (!Array.isArray(liveVaults)) return;

  if (liveVaults.length === 0) {
    ENUMERATION_DATA.vaults = [];
    currentVaultId = null;
    const navVaultCount = document.getElementById("nav-vault-count");
    if (navVaultCount) navVaultCount.textContent = "0";
    if (Boolean(document.getElementById("view-vaults"))) {
      renderActiveVault();
      renderVaultSwitcher();
    }
    return;
  }

  ENUMERATION_DATA.vaults = liveVaults.map(v => {
    return {
      id: v.id || v.name,
      name: v.name,
      resourceGroup: v.resourceGroup || "Azure Managed",
      location: v.location || "eastus",
      uri: v.uri || v.url || `https://${v.name}.vault.azure.net/`,
      resourceId: v.resourceId || v.id || "",
      status: v.status || "accessible",
      rbacAuth: Boolean(v.rbacAuth),
      softDelete: v.softDelete || "Disabled",
      purgeProtection: v.purgeProtection || "Disabled",
      publicNetwork: v.publicNetwork || "Enabled",
      secrets: (v.secrets || []).map(s => ({
        name: s.name,
        value: s.value !== undefined ? s.value : "",
        contentType: s.contentType || s.content_type || "secret",
        updated: s.updated || ""
      })),
      deleted_secrets: (v.deleted_secrets || []).map(ds => ({
        name: ds.name,
        id: ds.id || "",
        recovery_id: ds.recovery_id || "",
        deleted_date: ds.deleted_date || "",
        scheduled_purge_date: ds.scheduled_purge_date || ""
      })),
      keys: (v.keys || []).map(k => ({
        name: k.name,
        type: k.type || k.key_type || "RSA",
        status: k.status || (k.enabled_state !== false ? "Enabled" : "Disabled"),
        ops: k.ops || ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
        updated: k.updated || ""
      })),
      deleted_keys: (v.deleted_keys || []).map(dk => ({
        name: dk.name,
        id: dk.id || "",
        recovery_id: dk.recovery_id || "",
        key_type: dk.key_type || dk.type || "RSA",
        deleted_date: dk.deleted_date || "",
        scheduled_purge_date: dk.scheduled_purge_date || ""
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

  if (!currentVaultId || !ENUMERATION_DATA.vaults.some(v => v.id === currentVaultId)) {
    currentVaultId = ENUMERATION_DATA.vaults[0].id;
  }

  if (Boolean(document.getElementById("view-vaults"))) {
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

  if (!activeVault) {
    const toggleName = document.getElementById("vault-dd-selected-name");
    if (toggleName) toggleName.textContent = "No Key Vaults Discovered";

    const toggleBadge = document.getElementById("vault-dd-selected-badge");
    if (toggleBadge) toggleBadge.textContent = "0 secrets";

    const toggleDot = document.getElementById("vault-dd-status-dot");
    if (toggleDot) toggleDot.className = "status-dot restricted";

    const quickRg = document.getElementById("vault-quick-rg");
    if (quickRg) quickRg.textContent = "N/A";

    const quickRegion = document.getElementById("vault-quick-region");
    if (quickRegion) quickRegion.textContent = "N/A";

    const quickStatus = document.getElementById("vault-quick-status");
    if (quickStatus) quickStatus.textContent = "N/A";

    const countTag = document.getElementById("vault-dropdown-count");
    if (countTag) countTag.textContent = "0 vaults";

    const optionsContainer = document.getElementById("vault-dropdown-options");
    if (optionsContainer) {
      optionsContainer.innerHTML = `<div class="vault-dropdown-empty">No key vaults discovered in subscription</div>`;
    }
    return;
  }

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
  if (!ENUMERATION_DATA.resourceGroups || ENUMERATION_DATA.resourceGroups.length === 0) return null;
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
    breadcrumbCurrent.textContent = rg ? `Resource Groups // ${rg.name}` : `Resource Groups`;
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

  if (!activeRg) {
    const toggleName = document.getElementById("rg-dd-selected-name");
    if (toggleName) toggleName.textContent = "No Resource Groups";

    const toggleBadge = document.getElementById("rg-dd-selected-badge");
    if (toggleBadge) toggleBadge.textContent = "0 groups";

    const toggleDot = document.getElementById("rg-dd-status-dot");
    if (toggleDot) toggleDot.className = "status-dot restricted";

    const quickLoc = document.getElementById("rg-quick-location");
    if (quickLoc) quickLoc.textContent = "N/A";

    const quickCount = document.getElementById("rg-quick-count");
    if (quickCount) quickCount.textContent = "0 Resources";

    const quickStatus = document.getElementById("rg-quick-status");
    if (quickStatus) quickStatus.textContent = "N/A";

    const countTag = document.getElementById("rg-dropdown-count");
    if (countTag) countTag.textContent = "0 groups";

    const optionsContainer = document.getElementById("rg-dropdown-options");
    if (optionsContainer) {
      optionsContainer.innerHTML = `<div class="vault-dropdown-empty">No resource groups discovered</div>`;
    }
    return;
  }

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

  if (!rg) {
    const titleEl = document.getElementById("rg-detail-title");
    if (titleEl) titleEl.textContent = "No Resource Group Selected";

    const resIdText = document.getElementById("rg-res-id-text");
    if (resIdText) resIdText.textContent = "N/A";

    const configTagsEl = document.getElementById("rg-config-tags");
    if (configTagsEl) {
      configTagsEl.innerHTML = '<span class="tag tag-neutral">No Active Group</span>';
    }

    const countAll = document.getElementById("count-rg-all");
    if (countAll) countAll.textContent = "0";

    renderRgResourcesTable([]);
    return;
  }

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
    if (resourceGroups.length === 0) {
      rgTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No resource groups discovered in subscription</td></tr>';
    } else {
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
  }

  // Render Discovered Vaults Previews (Right Column)
  const previewsContainer = document.getElementById("dash-vault-previews");
  if (previewsContainer) {
    previewsContainer.innerHTML = "";
    if (vaults.length === 0) {
      previewsContainer.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem; font-size: 0.85rem;">No key vaults discovered in subscription</div>';
    } else {
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
  }

  // Render Recon Timeline
  const timelineList = document.getElementById("dash-timeline-list");
  if (timelineList) {
    timelineList.innerHTML = "";
    const activeTimeline = (reconTimeline && reconTimeline.length > 0) 
      ? reconTimeline 
      : generateReconTimeline(ENUMERATION_DATA.tenant, ENUMERATION_DATA.subscription, vaults, resourceGroups);

    activeTimeline.forEach(item => {
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

  if (ENUMERATION_DATA.resourceGroups.length === 0) {
    rgListEl.innerHTML = '<li style="color: var(--text-muted); font-size: 0.75rem; padding: 0.5rem 0.75rem;">No resource groups found</li>';
    return;
  }

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
  
  if (!vault) {
    const vaultTitle = document.getElementById("vault-title");
    if (vaultTitle) vaultTitle.textContent = "No Key Vault Selected";

    const vaultUriText = document.getElementById("vault-uri-text");
    if (vaultUriText) vaultUriText.textContent = "N/A";

    const configTagsEl = document.getElementById("config-tags");
    if (configTagsEl) {
      configTagsEl.innerHTML = '<span class="tag tag-neutral">No Vault Active</span>';
    }

    const countSecrets = document.getElementById("count-secrets");
    if (countSecrets) countSecrets.textContent = "0";

    const countDelSecrets = document.getElementById("count-del-secrets");
    if (countDelSecrets) countDelSecrets.textContent = "0";

    const countKeys = document.getElementById("count-keys");
    if (countKeys) countKeys.textContent = "0";

    const countDelKeys = document.getElementById("count-del-keys");
    if (countDelKeys) countDelKeys.textContent = "0";

    const countCerts = document.getElementById("count-certs");
    if (countCerts) countCerts.textContent = "0";

    renderSecretsTable([]);
    renderDeletedSecretsTable([]);
    renderKeysTable([]);
    renderDeletedKeysTable([]);
    renderCertsTable([]);
    return;
  }

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
    const softDelStr = vault.softDelete || "Disabled";
    const purgeProtStr = vault.purgeProtection || "Disabled";
    const isSoftDelDisabled = softDelStr.includes("Disabled");
    configTagsEl.innerHTML = `
      <span class="tag tag-neutral">
        Auth: ${vault.rbacAuth ? 'Azure RBAC' : 'Vault Access Policies'}
      </span>
      <span class="tag ${isSoftDelDisabled ? 'tag-warning' : 'tag-cyan'}">
        Soft Delete: ${escapeHtml(softDelStr)}
      </span>
      <span class="tag ${purgeProtStr === 'Enabled' ? 'tag-cyan' : 'tag-neutral'}">
        Purge Protection: ${escapeHtml(purgeProtStr)}
      </span>
      <span class="tag tag-neutral">
        Network: ${escapeHtml(vault.publicNetwork || 'Enabled')}
      </span>
    `;
  }

  // Tab Counts
  const countSecrets = document.getElementById("count-secrets");
  if (countSecrets) countSecrets.textContent = vault.secrets.length;

  const countDelSecrets = document.getElementById("count-del-secrets");
  if (countDelSecrets) countDelSecrets.textContent = (vault.deleted_secrets || []).length;

  const countKeys = document.getElementById("count-keys");
  if (countKeys) countKeys.textContent = vault.keys.length;

  const countDelKeys = document.getElementById("count-del-keys");
  if (countDelKeys) countDelKeys.textContent = (vault.deleted_keys || []).length;

  const countCerts = document.getElementById("count-certs");
  if (countCerts) countCerts.textContent = vault.certificates.length;

  renderSecretsTable(vault.secrets);
  renderDeletedSecretsTable(vault.deleted_secrets || [], vault.uri);
  renderKeysTable(vault.keys);
  renderDeletedKeysTable(vault.deleted_keys || [], vault.uri);
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

function renderDeletedSecretsTable(delSecrets, vaultUri = "", searchFilter = "") {
  const tbody = document.getElementById("del-secrets-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const filterLower = (searchFilter || "").trim().toLowerCase();
  const filtered = (delSecrets || []).filter(s =>
    !filterLower ||
    (s.name && s.name.toLowerCase().includes(filterLower)) ||
    (s.recovery_id && s.recovery_id.toLowerCase().includes(filterLower))
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No deleted secrets found in this vault</td></tr>`;
    return;
  }

  filtered.forEach((secret, index) => {
    const tr = document.createElement("tr");
    const recId = secret.recovery_id || "";
    const shortRecId = recId ? (recId.length > 35 ? "..." + recId.substring(recId.lastIndexOf('/')) : recId) : "N/A";

    tr.innerHTML = `
      <td>
        <span class="secret-name" style="color: #f87171;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          ${escapeHtml(secret.name)}
        </span>
      </td>
      <td style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.8rem;">
        ${escapeHtml(secret.deleted_date || "N/A")}
      </td>
      <td>
        <span class="tag tag-warning font-mono" style="font-size: 0.75rem;">
          ${escapeHtml(secret.scheduled_purge_date || "N/A")}
        </span>
      </td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(recId)}">
            ${escapeHtml(shortRecId)}
          </span>
          ${recId ? `
            <button class="action-icon-btn" onclick="copyText('${escapeHtml(recId)}', 'Recovery ID copied')" title="Copy Recovery ID">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          ` : ''}
        </div>
      </td>
      <td>
        <button class="action-btn-sm action-btn-recover" id="btn-recover-${index}" onclick="recoverAndRevealSecret('${escapeHtml(vaultUri)}', '${escapeHtml(secret.name)}', this)" title="Recover secret and read plaintext value">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          <span>Recover & View Value</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
window.renderDeletedSecretsTable = renderDeletedSecretsTable;

async function recoverAndRevealSecret(vaultUri, secretName, btnEl) {
  if (!vaultUri || !secretName) {
    showToast("Invalid vault or secret name");
    return;
  }

  const origHtml = btnEl ? btnEl.innerHTML : "";
  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      <span>Recovering...</span>
    `;
  }

  showToast(`Initiating recovery for "${secretName}"...`);

  try {
    const res = await fetch("/api/keyvault/recover-secret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vault_url: vaultUri, secret_name: secretName })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to recover secret from Key Vault");
    }

    showToast(`Secret "${secretName}" recovered successfully!`);
    openSecretModal(data);

    // Refresh dynamic data so active secrets list displays the newly restored secret
    fetch("/api/overview")
      .then(r => r.json())
      .then(freshData => {
        if (freshData && freshData.success && typeof window.syncDashboardData === "function") {
          window.syncDashboardData(freshData);
        }
      })
      .catch(() => {});

  } catch (err) {
    console.error("Recovery error:", err);
    showToast(`Error: ${err.message}`);
    alert(`Could not recover secret "${secretName}":\n\n${err.message}`);
  } finally {
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.innerHTML = origHtml;
    }
  }
}
window.recoverAndRevealSecret = recoverAndRevealSecret;

function renderDeletedKeysTable(delKeys, vaultUri = "", searchFilter = "") {
  const tbody = document.getElementById("del-keys-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const filterLower = (searchFilter || "").trim().toLowerCase();
  const filtered = (delKeys || []).filter(k =>
    !filterLower ||
    (k.name && k.name.toLowerCase().includes(filterLower)) ||
    (k.recovery_id && k.recovery_id.toLowerCase().includes(filterLower)) ||
    (k.key_type && k.key_type.toLowerCase().includes(filterLower))
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No deleted cryptographic keys found in this vault</td></tr>`;
    return;
  }

  filtered.forEach((key, index) => {
    const tr = document.createElement("tr");
    const recId = key.recovery_id || "";
    const shortRecId = recId ? (recId.length > 35 ? "..." + recId.substring(recId.lastIndexOf('/')) : recId) : "N/A";
    const keyType = key.key_type || key.type || "RSA";

    tr.innerHTML = `
      <td>
        <span class="key-name" style="color: #f87171;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          ${escapeHtml(key.name)}
        </span>
      </td>
      <td><span style="font-family: var(--font-mono); color: #cbd5e1;">${escapeHtml(keyType)}</span></td>
      <td style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.8rem;">
        ${escapeHtml(key.deleted_date || "N/A")}
      </td>
      <td>
        <span class="tag tag-warning font-mono" style="font-size: 0.75rem;">
          ${escapeHtml(key.scheduled_purge_date || "N/A")}
        </span>
      </td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(recId)}">
            ${escapeHtml(shortRecId)}
          </span>
          ${recId ? `
            <button class="action-icon-btn" onclick="copyText('${escapeHtml(recId)}', 'Recovery ID copied')" title="Copy Recovery ID">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          ` : ''}
        </div>
      </td>
      <td>
        <button class="action-btn-sm action-btn-recover" id="btn-recover-key-${index}" onclick="recoverKey('${escapeHtml(vaultUri)}', '${escapeHtml(key.name)}', this)" title="Restore soft-deleted key back into active inventory">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          <span>Recover Key</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
window.renderDeletedKeysTable = renderDeletedKeysTable;

async function recoverKey(vaultUri, keyName, btnEl) {
  if (!vaultUri || !keyName) {
    showToast("Invalid vault or key name");
    return;
  }

  const origHtml = btnEl ? btnEl.innerHTML : "";
  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      <span>Recovering...</span>
    `;
  }

  showToast(`Initiating recovery for key "${keyName}"...`);

  try {
    const res = await fetch("/api/keyvault/recover-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vault_url: vaultUri, key_name: keyName })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to recover key from Key Vault");
    }

    showToast(`Key "${keyName}" recovered successfully!`);

    // Refresh dynamic data so active keys list displays the newly restored key
    fetch("/api/overview")
      .then(r => r.json())
      .then(freshData => {
        if (freshData && freshData.success && typeof window.syncDashboardData === "function") {
          window.syncDashboardData(freshData);
        }
      })
      .catch(() => {});

  } catch (err) {
    console.error("Key recovery error:", err);
    showToast(`Error: ${err.message}`);
    alert(`Could not recover key "${keyName}":\n\n${err.message}`);
  } finally {
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.innerHTML = origHtml;
    }
  }
}
window.recoverKey = recoverKey;

function openSecretModal(data) {
  const backdrop = document.getElementById("secret-modal-backdrop");
  if (!backdrop) return;

  const titleEl = document.getElementById("modal-secret-title");
  const subtitleEl = document.getElementById("modal-secret-subtitle");
  const statusEl = document.getElementById("modal-secret-status");
  const typeEl = document.getElementById("modal-secret-type");
  const updatedEl = document.getElementById("modal-secret-updated");
  const valueEl = document.getElementById("modal-secret-value");
  const lengthEl = document.getElementById("modal-value-length");

  const name = data.name || "Secret";
  const val = data.value !== undefined ? data.value : "";
  const contentType = data.content_type || "secret";
  const updated = data.updated || "Just now";

  if (titleEl) titleEl.textContent = `Secret Recovered: ${name}`;
  if (subtitleEl) subtitleEl.textContent = `Retrieved from Azure Key Vault`;
  if (statusEl) statusEl.textContent = "Active / Restored";
  if (typeEl) typeEl.textContent = contentType;
  if (updatedEl) updatedEl.textContent = updated;
  if (valueEl) valueEl.value = val;
  if (lengthEl) lengthEl.textContent = `${val.length} characters`;

  backdrop.style.display = "flex";
}
window.openSecretModal = openSecretModal;

function closeSecretModal() {
  const backdrop = document.getElementById("secret-modal-backdrop");
  if (backdrop) {
    backdrop.style.display = "none";
  }
}
window.closeSecretModal = closeSecretModal;

function copyRecoveredSecretValue() {
  const valueEl = document.getElementById("modal-secret-value");
  if (!valueEl || !valueEl.value) {
    showToast("No secret value to copy");
    return;
  }
  navigator.clipboard.writeText(valueEl.value).then(() => {
    showToast("Plaintext secret value copied to clipboard!");
  }).catch(() => {
    showToast("Failed to copy value to clipboard");
  });
}
window.copyRecoveredSecretValue = copyRecoveredSecretValue;

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
  if (!vault || !vault.uri) {
    showToast("No active vault URI available");
    return;
  }
  navigator.clipboard.writeText(vault.uri).then(() => {
    showToast("Vault URI copied to clipboard");
  });
}

function exportVaultSecretsJson() {
  const vault = getActiveVault();
  if (!vault) {
    showToast("No active key vault selected");
    return;
  }
  const payload = {
    vault: vault.name,
    uri: vault.uri,
    resourceGroup: vault.resourceGroup,
    location: vault.location,
    secrets: vault.secrets || [],
    deleted_secrets: vault.deleted_secrets || [],
    keys: vault.keys || [],
    deleted_keys: vault.deleted_keys || [],
    certificates: vault.certificates || []
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
  const a = document.createElement("a");
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `${vault.name}_secrets.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast(`Exported ${vault.name} secrets to JSON`);
}
window.exportVaultSecretsJson = exportVaultSecretsJson;

function generateReconTimeline(tenant, sub, vaults, rgs) {
  const timeline = [];
  const now = new Date();
  const formatTime = (offsetSec) => {
    const d = new Date(now.getTime() - offsetSec * 1000);
    return d.toTimeString().split(' ')[0];
  };

  const user = (tenant && tenant.account) || "Azure CLI User";
  const subName = (sub && (sub.displayName || sub.name)) || "Active Subscription";
  const subId = (sub && sub.subscriptionId) || "N/A";
  const tenantId = (tenant && tenant.tenantId) || "N/A";

  timeline.push({
    time: formatTime(25),
    event: `Authenticated via Azure CLI token (Identity: ${user})`,
    alert: false
  });

  if (tenantId && tenantId !== "N/A") {
    timeline.push({
      time: formatTime(20),
      event: `Resolved Tenant ID: ${tenantId} (${tenant.name || tenant.primaryDomain || 'Azure Active Directory'})`,
      alert: false
    });
  }

  timeline.push({
    time: formatTime(15),
    event: `Targeted Subscription: ${subName} (${subId})`,
    alert: false
  });

  if (rgs && rgs.length > 0) {
    const rgNames = rgs.slice(0, 3).map(r => r.name).join(", ");
    timeline.push({
      time: formatTime(10),
      event: `Enumerated ${rgs.length} Resource Group(s) (${rgNames}${rgs.length > 3 ? '...' : ''})`,
      alert: false
    });
  } else {
    timeline.push({
      time: formatTime(10),
      event: `Queried Resource Groups: 0 returned from ARM provider`,
      alert: false
    });
  }

  if (vaults && vaults.length > 0) {
    const vNames = vaults.map(v => v.name).join(", ");
    timeline.push({
      time: formatTime(5),
      event: `Discovered ${vaults.length} Key Vault instance(s) (${vNames})`,
      alert: false
    });
    vaults.forEach(v => {
      const sCount = (v.secrets || []).length;
      const kCount = (v.keys || []).length;
      const cCount = (v.certificates || []).length;
      timeline.push({
        time: formatTime(2),
        event: `Key Vault [${v.name}]: enumerated ${sCount} secrets, ${kCount} keys, ${cCount} certs (${v.status})`,
        alert: false
      });
    });
  } else {
    timeline.push({
      time: formatTime(5),
      event: `Key Vault discovery: 0 accessible vaults discovered in subscription`,
      alert: false
    });
  }

  timeline.push({
    time: formatTime(0),
    event: `Security reconnaissance mapping active and up-to-date`,
    alert: false
  });

  return timeline;
}

function syncDashboardData(liveData) {
  if (!liveData) return;

  if (liveData.tenant_data) {
    ENUMERATION_DATA.tenant.name = liveData.tenant_data.tenant_name || "";
    ENUMERATION_DATA.tenant.tenantId = liveData.tenant_data.tenant_id || "";
    ENUMERATION_DATA.tenant.primaryDomain = liveData.tenant_data.tenant_domain || "";
  }
  if (liveData.username) {
    ENUMERATION_DATA.tenant.account = liveData.username;
    const topUser = document.getElementById("top-user-name");
    if (topUser) topUser.textContent = liveData.username;
    const sideAccount = document.getElementById("sidebar-account-name");
    if (sideAccount) sideAccount.textContent = liveData.username;
  }
  if (liveData.tenant_domain) {
    const sideDomain = document.getElementById("sidebar-tenant-domain");
    if (sideDomain) sideDomain.textContent = liveData.tenant_domain;
  }
  if (liveData.sub_data) {
    ENUMERATION_DATA.subscription.displayName = liveData.sub_data.sub_name || "";
    ENUMERATION_DATA.subscription.subscriptionId = liveData.sub_data.sub_id || "";
    ENUMERATION_DATA.subscription.state = liveData.sub_data.sub_state || "Active";
    ENUMERATION_DATA.tenant.cloudEnvironment = liveData.sub_data.cloud_name || "AzureCloud";
  }

  if (Array.isArray(liveData.vaults)) {
    syncBackendVaults(liveData.vaults);
  }
  if (Array.isArray(liveData.groups)) {
    syncBackendResourceGroups(liveData.groups, liveData.resources || []);
  }

  ENUMERATION_DATA.reconTimeline = generateReconTimeline(
    ENUMERATION_DATA.tenant,
    ENUMERATION_DATA.subscription,
    ENUMERATION_DATA.vaults,
    ENUMERATION_DATA.resourceGroups
  );

  renderHeaderAndSidebarInfo();
  if (Boolean(document.getElementById("view-dashboard"))) {
    renderDashboard();
  }
  if (Boolean(document.getElementById("view-vaults"))) {
    renderActiveVault();
    renderVaultSwitcher();
  }
  if (Boolean(document.getElementById("view-resource-groups"))) {
    renderActiveResourceGroup();
    renderRgDropdown();
  }
}
window.syncDashboardData = syncDashboardData;

async function refreshEnumeration() {
  const btn = document.getElementById("btn-refresh-enum");
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = "0.7";
  }
  showToast("Scanning Azure infrastructure...");
  try {
    const res = await fetch("/api/refresh");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (data && data.success) {
      syncDashboardData(data);
      const vaultCount = data.vaults ? data.vaults.length : 0;
      const secretCount = data.metrics ? data.metrics.secrets_count : 0;
      const rgCount = data.groups ? data.groups.length : 0;
      showToast(`Scan verified: ${vaultCount} vaults, ${secretCount} secrets, ${rgCount} resource groups loaded`);
    } else {
      showToast("Scan completed with warnings");
    }
  } catch (err) {
    console.error("Refresh error:", err);
    showToast("Scan error: " + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = "1";
    }
  }
}
window.refreshEnumeration = refreshEnumeration;

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
      if (vault) {
        renderSecretsTable(vault.secrets, e.target.value);
      }
    });
  }

  // Deleted Secrets Search
  const delSecretSearchInput = document.getElementById("del-secret-search-input");
  if (delSecretSearchInput) {
    delSecretSearchInput.addEventListener("input", (e) => {
      const vault = getActiveVault();
      if (vault) {
        renderDeletedSecretsTable(vault.deleted_secrets || [], vault.uri, e.target.value);
      }
    });
  }

  // Deleted Keys Search
  const delKeySearchInput = document.getElementById("del-key-search-input");
  if (delKeySearchInput) {
    delKeySearchInput.addEventListener("input", (e) => {
      const vault = getActiveVault();
      if (vault) {
        renderDeletedKeysTable(vault.deleted_keys || [], vault.uri, e.target.value);
      }
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

  // Close dropdowns and modals when clicking outside or pressing Escape
  document.addEventListener("click", (e) => {
    const vaultDd = document.getElementById("vault-dropdown");
    if (vaultDd && vaultDd.classList.contains("open") && !vaultDd.contains(e.target)) {
      closeVaultDropdown();
    }
    const rgDd = document.getElementById("rg-dropdown");
    if (rgDd && rgDd.classList.contains("open") && !rgDd.contains(e.target)) {
      closeRgDropdown();
    }
    const modalBackdrop = document.getElementById("secret-modal-backdrop");
    if (modalBackdrop && e.target === modalBackdrop) {
      closeSecretModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeVaultDropdown();
      closeRgDropdown();
      closeSecretModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", initApp);
