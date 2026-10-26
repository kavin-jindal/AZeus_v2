/**
 * AZeus v2 - Key Vault UI Module
 * Handles Key Vault specific rendering, tab switches, secret revelation,
 * soft-deleted secret recovery, and export operations.
 */

// KeyVault module helper extensions
(function(window) {
  'use strict';

  // Expose dedicated KeyVault module object
  window.KeyVaultModule = {
    getActiveVault: function() {
      return typeof window.getActiveVault === 'function' ? window.getActiveVault() : null;
    },

    revealSecret: function(index) {
      if (typeof window.toggleReveal === 'function') {
        window.toggleReveal(index);
      }
    },

    copySecret: function(val) {
      if (typeof window.copySecret === 'function') {
        window.copySecret(val);
      }
    },

    copySecretByIndex: function(index) {
      if (typeof window.copySecretByIndex === 'function') {
        window.copySecretByIndex(index);
      }
    },

    inspectSecret: function(index) {
      if (typeof window.inspectSecretByIndex === 'function') {
        window.inspectSecretByIndex(index);
      }
    },

    recoverAndReveal: function(vaultUri, secretName, btnEl) {
      if (typeof window.recoverAndRevealSecret === 'function') {
        return window.recoverAndRevealSecret(vaultUri, secretName, btnEl);
      }
    },

    recoverKey: function(vaultUri, keyName, btnEl) {
      if (typeof window.recoverKey === 'function') {
        return window.recoverKey(vaultUri, keyName, btnEl);
      }
    },

    restoreVault: function(vaultName, resourceGroup, location, btnEl) {
      if (typeof window.restoreKeyVault === 'function') {
        return window.restoreKeyVault(vaultName, resourceGroup, location, btnEl);
      }
    },

    switchSubTab: function(group, target) {
      if (typeof window.switchSubTab === 'function') {
        return window.switchSubTab(group, target);
      }
    },

    exportJson: function() {
      if (typeof window.exportVaultSecretsJson === 'function') {
        window.exportVaultSecretsJson();
      }
    }
  };

  console.log("AZeus KeyVaultModule initialized");
})(window);
