# AZeus v2

A simple Azure security dashboard and utility project for exploring tenant, subscription, and Key Vault information.

## What this project does

- Connects to Azure using the Azure SDK
- Reads the active Azure account and subscription details
- Lists available Key Vault resources
- Serves a small web UI for viewing the data

## Project structure

- `backend/` - Python modules for Azure account and Key Vault access
- `ui/` - frontend files used by the web app
- `main.py` - starts the Quart web app
- `app.js` - front-end logic/data for the dashboard
- `index.html` - main HTML entry point
- `styles.css` - styling for the dashboard
- `test.py` - sample script for Azure account and vault checks

## Setup

1. Install Python dependencies

   ```bash
   pip install quart azure-identity azure-mgmt-subscription azure-mgmt-keyvault azure-keyvault-secrets azure-keyvault-certificates azure-keyvault-keys
   ```

2. Make sure Azure CLI is logged in

   ```bash
   az login
   ```

3. Start the app

   ```bash
   python main.py
   ```

4. Open the app in your browser

   ```text
   http://localhost:8089
   ```

## Notes

This is a lightweight prototype and is meant to be easy to understand and extend. The current version focuses on Azure account discovery and Key Vault visibility with a basic dashboard UI.
