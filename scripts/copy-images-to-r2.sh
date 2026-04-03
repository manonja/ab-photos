#!/usr/bin/env bash
set -euo pipefail

# Copy images from GCP Cloud Storage (assets.bossenbroek.photo) to Cloudflare R2 (ab-photos-images).
#
# Usage:
#   ./scripts/copy-images-to-r2.sh            # perform migration
#   ./scripts/copy-images-to-r2.sh --dry-run   # preview only
#
# NOTE: The landing/ folder exists in GCP but has zero references in code or DB.
# It is excluded as orphaned content. If needed later, add URLs manually.

R2_BUCKET="ab-photos-images"
BASE_URL="https://assets.bossenbroek.photo"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="$SCRIPT_DIR/../src/db/migrate-data.sql"
DRY_RUN=false

if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "=== DRY RUN MODE — no files will be downloaded or uploaded ==="
  echo
fi

# Create temp directory for downloads, clean up on exit
TMPDIR_WORK="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_WORK"' EXIT

# --- Collect image URLs ---

# Extract unique URLs from the migration SQL (bash 3 compatible — no mapfile)
ALL_URLS=()
while IFS= read -r line; do
  ALL_URLS+=("$line")
done < <(grep -o "https://assets\.bossenbroek\.photo/[^'\"]*" "$SQL_FILE" | sort -u)

SQL_COUNT=${#ALL_URLS[@]}

# Hardcoded about-page portrait
ALL_URLS+=("${BASE_URL}/anton_photo_resize.jpg")

TOTAL=${#ALL_URLS[@]}
echo "Found $TOTAL images to migrate ($SQL_COUNT from DB + 1 about-page portrait)"
echo

# --- URL-decode helper ---
# Decodes percent-encoded characters (e.g. %2B → +)
urldecode() {
  local encoded="$1"
  # Use printf to decode percent-encoded sequences
  printf '%b' "${encoded//%/\\x}"
}

# --- Migrate images ---
succeeded=0
failed=0
failed_list=()

for i in "${!ALL_URLS[@]}"; do
  url="${ALL_URLS[$i]}"
  idx=$((i + 1))

  # Strip base URL to get the path, then decode for the R2 key
  encoded_path="${url#${BASE_URL}/}"
  r2_key="$(urldecode "$encoded_path")"

  if $DRY_RUN; then
    echo "[$idx/$TOTAL] Would copy: $r2_key"
    succeeded=$((succeeded + 1))
    continue
  fi

  # Download from GCP (served via Cloudflare proxy)
  tmp_file="$TMPDIR_WORK/image_$idx.jpg"
  printf "[%d/%d] %s ... " "$idx" "$TOTAL" "$r2_key"

  if curl -sfL -o "$tmp_file" "$url"; then
    # Upload to R2
    if npx wrangler r2 object put "${R2_BUCKET}/${r2_key}" \
        --file="$tmp_file" \
        --content-type="image/jpeg" \
        --remote 2>/dev/null; then
      echo "[OK]"
      succeeded=$((succeeded + 1))
    else
      echo "[FAILED] (upload)"
      failed=$((failed + 1))
      failed_list+=("$r2_key")
    fi
    # Clean up individual file to save disk space
    rm -f "$tmp_file"
  else
    echo "[FAILED] (download)"
    failed=$((failed + 1))
    failed_list+=("$r2_key")
  fi
done

# --- Summary ---
echo
if $DRY_RUN; then
  echo "Dry run complete: $TOTAL images would be migrated"
else
  echo "Migration complete: $succeeded/$TOTAL succeeded, $failed failed"
  if [[ $failed -gt 0 ]]; then
    echo
    echo "Failed images:"
    for f in "${failed_list[@]}"; do
      echo "  - $f"
    done
    exit 1
  fi
fi
