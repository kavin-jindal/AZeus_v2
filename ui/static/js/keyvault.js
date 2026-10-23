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

    exportJson: function() {
      if (typeof window.exportVaultSecretsJson === 'function') {
        window.exportVaultSecretsJson();
      }
    }
  };

  console.log("AZeus KeyVaultModule initialized");
})(window);
