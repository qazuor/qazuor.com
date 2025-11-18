#!/usr/bin/env bash

###############################################################################
# Bundle Size Budget Checker
#
# Validates that bundle sizes stay within defined limits to prevent
# performance regressions.
#
# Usage:
#   ./scripts/check-budgets.sh
#   npm run check:budgets
#
# Exit codes:
#   0 - All checks passed
#   1 - One or more budgets exceeded
###############################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Budget limits (in KB)
# Note: These are set based on current optimized state + reasonable margin
# Adjust as needed based on project requirements
BUDGET_TOTAL_JS=1200     # Total JS bundle (current: ~1060KB)
BUDGET_MAIN_CHUNK=550    # Largest single chunk (current: ~532KB Timeline)
BUDGET_TOTAL_CSS=250     # Total CSS (current: ~220KB)
BUDGET_TOTAL_ASSETS=8000 # Total assets (current: ~7076KB, includes images)

# Distribution directory
DIST_DIR="dist"

# Check if dist directory exists
if [ ! -d "$DIST_DIR" ]; then
    echo -e "${RED}❌ Error: dist/ directory not found${NC}"
    echo "Please run 'npm run build' first"
    exit 1
fi

# Initialize result tracking
FAILED=0

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Bundle Size Budget Checker${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

###############################################################################
# 1. Check Total JavaScript Size
###############################################################################
echo -e "${YELLOW}📦 Checking JavaScript bundle size...${NC}"

if [ -d "$DIST_DIR/_astro" ]; then
    TOTAL_JS=$(find "$DIST_DIR/_astro" -name "*.js" -type f -exec du -k {} + | awk '{sum+=$1} END {print sum}')

    # Handle case where no JS files found
    if [ -z "$TOTAL_JS" ]; then
        TOTAL_JS=0
    fi

    echo "   Total JS: ${TOTAL_JS}KB / ${BUDGET_TOTAL_JS}KB"

    if [ "$TOTAL_JS" -gt "$BUDGET_TOTAL_JS" ]; then
        echo -e "   ${RED}❌ FAILED: JS bundle exceeds budget by $((TOTAL_JS - BUDGET_TOTAL_JS))KB${NC}"
        FAILED=1
    else
        REMAINING=$((BUDGET_TOTAL_JS - TOTAL_JS))
        echo -e "   ${GREEN}✓ PASSED (${REMAINING}KB remaining)${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠ Warning: _astro directory not found${NC}"
fi

echo ""

###############################################################################
# 2. Check Largest JavaScript Chunk
###############################################################################
echo -e "${YELLOW}📄 Checking largest JS chunk...${NC}"

if [ -d "$DIST_DIR/_astro" ]; then
    LARGEST_CHUNK=$(find "$DIST_DIR/_astro" -name "*.js" -type f -exec du -k {} + | sort -rn | head -1 | awk '{print $1}')
    LARGEST_FILE=$(find "$DIST_DIR/_astro" -name "*.js" -type f -exec du -k {} + | sort -rn | head -1 | awk '{print $2}' | xargs basename)

    # Handle case where no JS files found
    if [ -z "$LARGEST_CHUNK" ]; then
        LARGEST_CHUNK=0
        LARGEST_FILE="none"
    fi

    echo "   Largest chunk: ${LARGEST_CHUNK}KB / ${BUDGET_MAIN_CHUNK}KB"
    echo "   File: ${LARGEST_FILE}"

    if [ "$LARGEST_CHUNK" -gt "$BUDGET_MAIN_CHUNK" ]; then
        echo -e "   ${RED}❌ FAILED: Largest chunk exceeds budget by $((LARGEST_CHUNK - BUDGET_MAIN_CHUNK))KB${NC}"
        FAILED=1
    else
        REMAINING=$((BUDGET_MAIN_CHUNK - LARGEST_CHUNK))
        echo -e "   ${GREEN}✓ PASSED (${REMAINING}KB remaining)${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠ Warning: _astro directory not found${NC}"
fi

echo ""

###############################################################################
# 3. Check Total CSS Size
###############################################################################
echo -e "${YELLOW}🎨 Checking CSS bundle size...${NC}"

if [ -d "$DIST_DIR/_astro" ]; then
    TOTAL_CSS=$(find "$DIST_DIR/_astro" -name "*.css" -type f -exec du -k {} + | awk '{sum+=$1} END {print sum}')

    # Handle case where no CSS files found
    if [ -z "$TOTAL_CSS" ]; then
        TOTAL_CSS=0
    fi

    echo "   Total CSS: ${TOTAL_CSS}KB / ${BUDGET_TOTAL_CSS}KB"

    if [ "$TOTAL_CSS" -gt "$BUDGET_TOTAL_CSS" ]; then
        echo -e "   ${RED}❌ FAILED: CSS bundle exceeds budget by $((TOTAL_CSS - BUDGET_TOTAL_CSS))KB${NC}"
        FAILED=1
    else
        REMAINING=$((BUDGET_TOTAL_CSS - TOTAL_CSS))
        echo -e "   ${GREEN}✓ PASSED (${REMAINING}KB remaining)${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠ Warning: _astro directory not found${NC}"
fi

echo ""

###############################################################################
# 4. Check Total Assets Size
###############################################################################
echo -e "${YELLOW}🖼️  Checking total assets size...${NC}"

TOTAL_ASSETS=$(du -sk "$DIST_DIR/_astro" 2>/dev/null | awk '{print $1}')

# Handle case where directory doesn't exist
if [ -z "$TOTAL_ASSETS" ]; then
    TOTAL_ASSETS=0
fi

echo "   Total assets: ${TOTAL_ASSETS}KB / ${BUDGET_TOTAL_ASSETS}KB"

if [ "$TOTAL_ASSETS" -gt "$BUDGET_TOTAL_ASSETS" ]; then
    echo -e "   ${RED}❌ FAILED: Total assets exceed budget by $((TOTAL_ASSETS - BUDGET_TOTAL_ASSETS))KB${NC}"
    FAILED=1
else
    REMAINING=$((BUDGET_TOTAL_ASSETS - TOTAL_ASSETS))
    echo -e "   ${GREEN}✓ PASSED (${REMAINING}KB remaining)${NC}"
fi

echo ""

###############################################################################
# 5. Top 5 Largest Files
###############################################################################
echo -e "${YELLOW}📊 Top 5 largest files:${NC}"

if [ -d "$DIST_DIR/_astro" ]; then
    find "$DIST_DIR/_astro" -type f -exec du -k {} + | sort -rn | head -5 | while read -r size file; do
        filename=$(basename "$file")
        echo "   ${size}KB - ${filename}"
    done
else
    echo -e "   ${YELLOW}⚠ No files found${NC}"
fi

echo ""

###############################################################################
# Final Result
###############################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$FAILED" -eq 0 ]; then
    echo -e "${GREEN}✅ All budget checks passed!${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Some budget checks failed${NC}"
    echo -e "${YELLOW}Consider:${NC}"
    echo "   • Code splitting large chunks"
    echo "   • Lazy loading heavy dependencies"
    echo "   • Optimizing images and assets"
    echo "   • Tree shaking unused code"
    echo ""
    exit 1
fi
