#!/bin/bash
#
# Visual Snapshots Update Script
# Runs visual regression tests in groups to avoid timeout issues
#
# Usage: ./scripts/update-visual-snapshots.sh [group-name]
# Examples:
#   ./scripts/update-visual-snapshots.sh          # Update all groups
#   ./scripts/update-visual-snapshots.sh Homepage # Update only Homepage group
#
# Environment variables:
#   USE_DEV_SERVER=1  - Use dev server instead of preview (slower but no build needed)
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
TIMEOUT=180000
TEST_DIR="tests/visual/"

# Test groups matching describe blocks in pages.spec.ts
GROUPS=(
    "Homepage"
    "Services Pages"
    "Theme Variations"
    "Interactive Components"
    "Critical UI"
    "Language Variations"
    "Responsive Breakpoints"
    "Error States"
    "Form States"
    "Command Palette"
)

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_group() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}📸 $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Track statistics
PASSED=0
FAILED=0
SKIPPED=0
FAILED_GROUPS=()

# Function to run tests for a specific group
run_group() {
    local group="$1"
    local start_time=$(date +%s)

    log_group "Updating: $group"
    log_info "Starting at $(date '+%H:%M:%S')"

    # Run playwright test with grep filter
    if npx playwright test "$TEST_DIR" \
        --update-snapshots \
        --grep "$group" \
        --timeout "$TIMEOUT" \
        --reporter=line 2>&1 | while IFS= read -r line; do
            # Log output with timestamp
            echo -e "  ${line}"
        done; then

        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        log_success "Completed: $group (${duration}s)"
        ((PASSED++))
        return 0
    else
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        log_error "Failed: $group (${duration}s)"
        FAILED_GROUPS+=("$group")
        ((FAILED++))
        return 1
    fi
}

# Function to print summary
print_summary() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}📊 SUMMARY${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${GREEN}Passed:${NC}  $PASSED"
    echo -e "  ${RED}Failed:${NC}  $FAILED"
    echo -e "  ${YELLOW}Skipped:${NC} $SKIPPED"
    echo ""

    if [ ${#FAILED_GROUPS[@]} -gt 0 ]; then
        echo -e "${RED}Failed groups:${NC}"
        for group in "${FAILED_GROUPS[@]}"; do
            echo -e "  - $group"
        done
        echo ""
        log_warning "Some groups failed. You can retry them individually:"
        for group in "${FAILED_GROUPS[@]}"; do
            echo -e "  ${YELLOW}./scripts/update-visual-snapshots.sh \"$group\"${NC}"
        done
    fi

    echo ""
}

# Main execution
main() {
    local total_start=$(date +%s)

    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║         Visual Snapshots Update Script                       ║${NC}"
    echo -e "${CYAN}║         Running tests in groups to avoid timeouts            ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""

    # Check if we need to build first (when using preview server)
    if [ -z "$USE_DEV_SERVER" ]; then
        log_info "Using preview server (production build)"
        log_info "Checking if build is needed..."

        if [ ! -d "dist" ] || [ ! -f "dist/client/index.html" ]; then
            log_warning "No build found, running build first..."
            npm run build
            if [ $? -ne 0 ]; then
                log_error "Build failed!"
                exit 1
            fi
            log_success "Build completed"
        else
            log_info "Using existing build (run 'npm run build' to refresh)"
        fi
    else
        log_info "Using dev server (USE_DEV_SERVER=1)"
    fi
    echo ""

    log_info "Timeout per test: ${TIMEOUT}ms"
    log_info "Test directory: $TEST_DIR"

    # Check if specific group was requested
    if [ -n "$1" ]; then
        log_info "Running single group: $1"
        run_group "$1"
        print_summary
        exit $?
    fi

    # Run all groups
    log_info "Running all ${#GROUPS[@]} groups sequentially"
    echo ""

    for group in "${GROUPS[@]}"; do
        # Continue even if one group fails (set +e temporarily)
        set +e
        run_group "$group"
        set -e
    done

    local total_end=$(date +%s)
    local total_duration=$((total_end - total_start))

    print_summary

    echo -e "Total time: ${total_duration}s ($(( total_duration / 60 ))m $(( total_duration % 60 ))s)"
    echo ""

    # Exit with error if any group failed
    if [ $FAILED -gt 0 ]; then
        log_error "Some visual snapshot updates failed"
        exit 1
    fi

    log_success "All visual snapshots updated successfully! 🎉"
    exit 0
}

# Run main function with all arguments
main "$@"
