#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Check if op (1Password CLI) is installed
if ! command -v op &> /dev/null; then
    echo "Error: 1Password CLI is not installed. Please install it first."
    echo "Visit: https://1password.com/downloads/command-line/"
    exit 1
fi

# Check if we're signed in to 1Password, specifically to Jacquin Family account
if ! op whoami &> /dev/null; then
    echo "Signing in to 1Password..."
    if ! op signin --account my.1password.com; then
        echo "Error: Failed to sign in to 1Password"
        exit 1
    fi
fi

# Define the vault and item where secrets are stored
VAULT="Private"  # Update this to your actual vault name
ITEM="ab-photos-secrets"

# Function to check if item exists and get secrets from 1Password
get_secrets() {
    # First verify the vault exists
    if ! op vault get "$VAULT" &> /dev/null; then
        echo "Error: Vault '$VAULT' not found. Available vaults:"
        op vault list
        return 1
    fi

    # Then verify the item exists
    if ! op item get "$ITEM" --vault "$VAULT" &> /dev/null; then
        echo "Error: Item '$ITEM' not found in vault '$VAULT'"
        echo "Available items in vault:"
        op item list --vault "$VAULT"
        return 1
    fi

    # Get the secrets
    local secrets
    if ! secrets=$(op item get "$ITEM" --vault "$VAULT" --format json | jq -r '.fields[] | select(.type == "CONCEALED") | "\(.label)=\(.value)"'); then
        echo "Error: Failed to retrieve secrets from 1Password"
        return 1
    fi

    if [ -z "$secrets" ]; then
        echo "Error: No secrets found in the 1Password item"
        return 1
    fi

    echo "$secrets"
    return 0
}

case "$1" in
    "local")
        echo "Setting up local .env.local file..."
        # Get secrets and write to .env.local
        if ! secrets=$(get_secrets); then
            echo "Failed to get secrets from 1Password. Aborting."
            exit 1
        fi
        
        echo "$secrets" > .env.local
        echo "✅ Local environment variables written to .env.local"
        ;;
        
    "cloudflare")
        echo "Updating Cloudflare Pages secrets..."
        # Create a temporary file for bulk secrets
        TEMP_FILE=$(mktemp)
        
        # Get secrets in Cloudflare format
        if ! secrets=$(get_secrets); then
            echo "Failed to get secrets from 1Password. Aborting Cloudflare update."
            rm "$TEMP_FILE"
            exit 1
        fi
        
        # Process the secrets
        while IFS='=' read -r key value; do
            # Skip empty lines
            [ -z "$key" ] && continue
            echo "${key} = ${value}" >> "$TEMP_FILE"
        done <<< "$secrets"
        
        # Check if we have any secrets to upload
        if [ ! -s "$TEMP_FILE" ]; then
            echo "⚠️  No secrets found to upload"
            rm "$TEMP_FILE"
            exit 1
        fi
        
        # Upload secrets in bulk
        if ! wrangler pages secret bulk "$TEMP_FILE" --project-name ab-photos; then
            echo "Error: Failed to update Cloudflare Pages secrets"
            rm "$TEMP_FILE"
            exit 1
        fi
        
        echo "✅ Secrets updated in Cloudflare Pages"
        echo "Current secrets in Cloudflare Pages:"
        wrangler pages secret list --project-name ab-photos
        
        # Clean up
        rm "$TEMP_FILE"
        ;;
        
    *)
        echo "Usage: $0 [local|cloudflare]"
        echo "  local      - Create .env.local file with secrets from 1Password"
        echo "  cloudflare - Update Cloudflare Pages secrets from 1Password"
        exit 1
        ;;
esac 