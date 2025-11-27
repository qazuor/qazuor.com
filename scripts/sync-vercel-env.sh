#!/bin/bash

# Sync environment variables from local .env to Vercel
# Usage: ./scripts/sync-vercel-env.sh [environment]
# Environments: production, preview, development (default: all)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/.env"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables to sync
VARS=(
    "RESEND_API_KEY"
    "CONTACT_EMAIL"
    "RESEND_FROM_EMAIL"
)

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: .env file not found at $ENV_FILE${NC}"
    echo -e "${YELLOW}Create it from .env.example:${NC}"
    echo "  cp .env.example .env"
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Error: Vercel CLI is not installed${NC}"
    echo -e "${YELLOW}Install it with:${NC}"
    echo "  pnpm add -g vercel"
    exit 1
fi

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}Error: Not logged in to Vercel${NC}"
    echo -e "${YELLOW}Login with:${NC}"
    echo "  vercel login"
    exit 1
fi

# Check if project is linked
if [ ! -d "$PROJECT_ROOT/.vercel" ]; then
    echo -e "${RED}Error: Project not linked to Vercel${NC}"
    echo -e "${YELLOW}Link it with:${NC}"
    echo "  vercel link"
    exit 1
fi

# Parse environment argument
ENVIRONMENTS=("production" "preview" "development")
if [ -n "$1" ]; then
    ENVIRONMENTS=("$1")
fi

echo -e "${BLUE}=== Syncing environment variables to Vercel ===${NC}"
echo -e "Source: ${GREEN}$ENV_FILE${NC}"
echo -e "Target environments: ${GREEN}${ENVIRONMENTS[*]}${NC}"
echo ""

# Read .env file and extract values
declare -A ENV_VALUES

while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ -z "$line" ]] && continue

    # Parse KEY=VALUE
    if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        # Remove surrounding quotes if present
        value="${value%\"}"
        value="${value#\"}"
        value="${value%\'}"
        value="${value#\'}"
        ENV_VALUES["$key"]="$value"
    fi
done < "$ENV_FILE"

# Sync each variable
SUCCESS_COUNT=0
FAIL_COUNT=0

for var in "${VARS[@]}"; do
    value="${ENV_VALUES[$var]}"

    if [ -z "$value" ]; then
        echo -e "${YELLOW}⚠ Skipping $var (not found in .env)${NC}"
        continue
    fi

    echo -e "${BLUE}→ Setting $var...${NC}"

    for env in "${ENVIRONMENTS[@]}"; do
        # Remove existing variable (ignore errors if it doesn't exist)
        vercel env rm "$var" "$env" -y 2>/dev/null || true

        # Add new value
        if echo "$value" | vercel env add "$var" "$env" 2>/dev/null; then
            echo -e "  ${GREEN}✓ $env${NC}"
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        else
            echo -e "  ${RED}✗ $env (failed)${NC}"
            FAIL_COUNT=$((FAIL_COUNT + 1))
        fi
    done
done

echo ""
echo -e "${BLUE}=== Summary ===${NC}"
echo -e "${GREEN}✓ Success: $SUCCESS_COUNT${NC}"
if [ "$FAIL_COUNT" -gt 0 ]; then
    echo -e "${RED}✗ Failed: $FAIL_COUNT${NC}"
fi

echo ""
echo -e "${YELLOW}Note: Changes will take effect on next deployment.${NC}"
echo -e "To deploy now: ${GREEN}vercel --prod${NC}"
