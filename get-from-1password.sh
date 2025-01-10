#!/bin/bash

# Check if op (1Password CLI) is installed
if ! command -v op &> /dev/null; then
    echo "1Password CLI is not installed. Please install it first."
    exit 1
fi

# Check if logged in to 1Password
if ! op account get &> /dev/null; then
    echo "Please log in to 1Password CLI first using: op signin"
    exit 1
fi

VAULT="ab-photography"

# Verify vault exists
if ! op vault get "$VAULT" &> /dev/null; then
    echo "Error: Vault '$VAULT' not found"
    exit 1
fi

# Get the item reference
ITEM_REF="AB Photography ENV"

# Create .env.local file with retrieved values
{
    echo "DIRECT_URL=$(op item get "$ITEM_REF" --vault "$VAULT" --field DIRECT_URL)"
    echo "DATABASE_URL=$(op item get "$ITEM_REF" --vault "$VAULT" --field DATABASE_URL)"
    echo "NEXT_PUBLIC_API_URL=$(op item get "$ITEM_REF" --vault "$VAULT" --field NEXT_PUBLIC_API_URL)"
    echo "NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID=$(op item get "$ITEM_REF" --vault "$VAULT" --field NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID)"
    echo "NEXT_PUBLIC_MAILCHIMP_API_KEY=$(op item get "$ITEM_REF" --vault "$VAULT" --field NEXT_PUBLIC_MAILCHIMP_API_KEY)"
    echo "NEXT_PUBLIC_MAILCHIMP_API_SERVER=$(op item get "$ITEM_REF" --vault "$VAULT" --field NEXT_PUBLIC_MAILCHIMP_API_SERVER)"
    echo "NEXT_PUBLIC_MAILCHIMP_URL=$(op item get "$ITEM_REF" --vault "$VAULT" --field NEXT_PUBLIC_MAILCHIMP_URL)"
    echo "NEXT_PUBLIC_CONTACT_FORM_URL=$(op item get "$ITEM_REF" --vault "$VAULT" --field NEXT_PUBLIC_CONTACT_FORM_URL)"
} > .env.local

if [ $? -eq 0 ]; then
    echo "Successfully created .env.local file with variables from 1Password"
else
    echo "Failed to create .env.local file"
    exit 1
fi 