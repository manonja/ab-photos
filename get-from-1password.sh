#!/usr/bin/env bash

# Strict mode
set -euo pipefail
IFS=$'\n\t'

# Set error handling
trap 'echo >&2 "Error on line $LINENO. Exit code: $?"' ERR

# Configuration
readonly VAULT="ab-photography"
readonly ITEM="6h2jubbrerykhpr4daumreuap4"
readonly CF_PROJECT="ab-photos"
readonly LOCAL_API_URL="http://localhost:8787"
readonly CF_API_URL="https://bossenbroek.photo"

# Define secrets to fetch (excluding NEXT_PUBLIC_API_URL as it's environment-specific)
declare -a SECRET_NAMES=(
    "DIRECT_URL"
    "DATABASE_URL"
    "NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID"
    "NEXT_PUBLIC_MAILCHIMP_API_KEY"
    "NEXT_PUBLIC_MAILCHIMP_API_SERVER"
    "NEXT_PUBLIC_MAILCHIMP_URL"
    "NEXT_PUBLIC_CONTACT_FORM_URL"
)

# Check if op (1Password CLI) is installed
if ! command -v op > /dev/null 2>&1; then
    printf >&2 "Error: 1Password CLI is not installed. Please install it first.\n"
    printf >&2 "Visit: https://1password.com/downloads/command-line/\n"
    exit 1
fi

# Check if we're signed in to 1Password
if ! op whoami > /dev/null 2>&1; then
    printf "Not signed in to 1Password. Checking available accounts...\n"
    
    # Try to get the list of accounts
    if accounts=$(op account list 2>/dev/null); then
        # If we have accounts, use the first one
        account_id=$(echo "$accounts" | head -n 1 | cut -d' ' -f1)
        printf "Found account: %s. Signing in...\n" "$account_id"
        if ! op signin --account "$account_id"; then
            printf >&2 "Error: Failed to sign in to 1Password\n"
            exit 1
        fi
    else
        # If no accounts configured, try manual signin
        printf "No accounts configured. Please sign in manually:\n"
        if ! op signin; then
            printf >&2 "Error: Failed to sign in to 1Password\n"
            exit 1
        fi
    fi
fi

# Function to get secrets from 1Password and add environment-specific API URL
get_secrets() {
    local env=$1
    local retries=3
    local retry_count=0
    local secrets=""
    
    # First verify the vault exists
    if ! op vault get "$VAULT" > /dev/null 2>&1; then
        printf >&2 "Error: Vault '%s' not found. Available vaults:\n" "$VAULT"
        op vault list
        return 1
    fi

    # Then verify the item exists
    if ! op item get "$ITEM" --vault "$VAULT" > /dev/null 2>&1; then
        printf >&2 "Error: Item '%s' not found in vault '%s'\n" "$ITEM" "$VAULT"
        printf "Available items in vault:\n"
        op item list --vault "$VAULT"
        return 1
    fi

    # Add environment-specific API URL
    if [ "$env" = "local" ]; then
        secrets="NEXT_PUBLIC_API_URL=${LOCAL_API_URL}\n"
    else
        secrets="NEXT_PUBLIC_API_URL=${CF_API_URL}\n"
    fi

    # Get each secret individually
    for secret_name in "${SECRET_NAMES[@]}"; do
        local value
        local reference="op://${VAULT}/${ITEM}/${secret_name}"
        local retry_count=0
        
        while [ "$retry_count" -lt "$retries" ]; do
            if value=$(op read "$reference" 2>/dev/null); then
                secrets="${secrets}${secret_name}=${value}\n"
                break
            fi
            
            ((retry_count++))
            if [ "$retry_count" -lt "$retries" ]; then
                printf "Retry %d of %d for %s...\n" "$retry_count" "$retries" "$secret_name"
                sleep 2
            fi
        done
        
        if [ "$retry_count" -eq "$retries" ]; then
            printf >&2 "Error: Failed to retrieve secret %s after %d attempts\n" "$secret_name" "$retries"
            return 1
        fi
    done

    printf "%b" "$secrets"
    return 0
}

# Function to validate Cloudflare configuration
check_cloudflare_config() {
    if ! command -v wrangler > /dev/null 2>&1; then
        printf >&2 "Error: Wrangler CLI is not installed. Please install it first:\n"
        printf >&2 "npm install -g wrangler\n"
        return 1
    fi

    # Verify Cloudflare authentication
    if ! wrangler whoami > /dev/null 2>&1; then
        printf >&2 "Error: Not authenticated with Cloudflare. Please run 'wrangler login' first.\n"
        return 1
    fi

    return 0
}

# Function to handle Cloudflare secrets update
handle_cloudflare_secrets() {
    if ! check_cloudflare_config; then
        return 1
    fi
    
    local temp_file
    temp_file=$(mktemp)
    chmod 600 "$temp_file"
    
    local secrets
    if ! secrets=$(get_secrets "cloudflare"); then
        printf >&2 "Failed to get secrets from 1Password. Aborting Cloudflare update.\n"
        rm -f "$temp_file"
        return 1
    fi
    
    # Process the secrets for Cloudflare format
    while IFS='=' read -r key value; do
        [ -z "$key" ] && continue
        printf "%s = %s\n" "$key" "$value" >> "$temp_file"
    done <<< "$secrets"
    
    if [ ! -s "$temp_file" ]; then
        printf >&2 "⚠️  No secrets found to upload\n"
        rm -f "$temp_file"
        return 1
    fi
    
    if ! wrangler pages secret bulk "$temp_file" --project-name "$CF_PROJECT"; then
        printf >&2 "Error: Failed to update Cloudflare Pages secrets\n"
        rm -f "$temp_file"
        return 1
    fi
    
    rm -f "$temp_file"
    
    printf "✅ Secrets updated in Cloudflare Pages\n"
    printf "Current secrets in Cloudflare Pages:\n"
    wrangler pages secret list --project-name "$CF_PROJECT"
    
    return 0
}

main() {
    local action="$1"
    local secrets

    case "$action" in
        "local")
            printf "Setting up local .env.local file...\n"
            if ! secrets=$(get_secrets "local"); then
                printf >&2 "Failed to get secrets from 1Password. Aborting.\n"
                exit 1
            fi
            
            # Backup existing .env.local if it exists
            if [ -f .env.local ]; then
                mv .env.local ".env.local.backup-$(date +%Y%m%d-%H%M%S)"
            fi
            
            printf "%b" "$secrets" > .env.local
            chmod 600 .env.local  # Secure file permissions
            printf "✅ Local environment variables written to .env.local\n"
            ;;
            
        "cloudflare")
            printf "Updating Cloudflare Pages secrets...\n"
            if ! handle_cloudflare_secrets; then
                exit 1
            fi
            ;;
            
        *)
            printf >&2 "Usage: %s [local|cloudflare]\n" "$0"
            printf >&2 "  local      - Create .env.local file with secrets from 1Password\n"
            printf >&2 "  cloudflare - Update Cloudflare Pages secrets from 1Password\n"
            exit 1
            ;;
    esac
}

# Check for required argument
if [ "$#" -ne 1 ]; then
    printf >&2 "Error: Missing required argument\n"
    printf >&2 "Usage: %s [local|cloudflare]\n" "$0"
    exit 1
fi

main "$1" 