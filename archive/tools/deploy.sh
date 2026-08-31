#!/usr/bin/env bash
# ============================================================
# Hexo Deploy Script for OwnWeb-Yetbye
# Usage:
#   ./deploy.sh                 # full: clean → generate → preview → deploy
#   ./deploy.sh --skip-preview  # skip local preview, deploy directly
#   ./deploy.sh --clean-only    # only clean, no build or deploy
#   ./deploy.sh --build-only    # clean + generate, no deploy
#   ./deploy.sh --status        # show project status summary
# ============================================================

set -euo pipefail

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# --- Config ---
HEXO_CMD="npx hexo"
PREVIEW_PORT=4000
DEPLOY_BRANCH="main"

# --- Cleanup trap ---
cleanup() {
    # Kill any background hexo server if running
    jobs -p 2>/dev/null | xargs -r kill 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# --- Functions ---
info()  { printf '%b\n' "${CYAN}[INFO]${NC} $*"; }
ok()    { printf '%b\n' "${GREEN}[OK]${NC} $*"; }
warn()  { printf '%b\n' "${YELLOW}[WARN]${NC} $*"; }
err()   { printf '%b\n' "${RED}[ERROR]${NC} $*"; }

check_env() {
    info "Checking environment..."

    # Check Node.js
    if ! command -v node >/dev/null 2>&1; then
        err "Node.js not found. Install from https://nodejs.org/"
        exit 1
    fi
    local node_ver
    node_ver=$(node -v)
    ok "Node.js: $node_ver"

    # Check npm
    if ! command -v npm >/dev/null 2>&1; then
        err "npm not found."
        exit 1
    fi
    ok "npm: $(npm -v)"

    # Check if in Hexo project
    if [ ! -f "package.json" ]; then
        err "Not in a Hexo project directory (no package.json)"
        exit 1
    fi

    # Check if hexo is installed (capture output once)
    local hexo_ver
    hexo_ver=$($HEXO_CMD version 2>/dev/null | head -1)
    if [ -z "$hexo_ver" ]; then
        warn "Hexo not found locally, installing..."
        npm install hexo
        hexo_ver=$($HEXO_CMD version 2>/dev/null | head -1)
    fi
    ok "Hexo: $hexo_ver"

    # Check theme
    if [ -d "themes/butterfly" ]; then
        if [ -d "themes/butterfly/.git" ]; then
            warn "Butterfly theme is a nested git repo (not submodule). Consider: npm install hexo-theme-butterfly"
        else
            ok "Butterfly theme: present"
        fi
    else
        warn "Butterfly theme not found in themes/"
    fi

    echo ""
}

show_status() {
    info "Project Status"
    echo "================================"

    # Git status
    echo -e "${CYAN}Git Branch:${NC} $(git branch --show-current 2>/dev/null || echo 'N/A')"
    echo -e "${CYAN}Git Remote:${NC} $(git remote get-url origin 2>/dev/null || echo 'N/A')"

    # Modified files
    local modified
    modified=$(git status --short 2>/dev/null | wc -l)
    echo -e "${CYAN}Modified files:${NC} $modified"

    # Source stats
    local posts
    posts=$(find source/_posts -name "*.md" 2>/dev/null | wc -l)
    echo -e "${CYAN}Posts:${NC} $posts"

    local images
    images=$(find source/image -type f 2>/dev/null | wc -l)
    echo -e "${CYAN}Images:${NC} $images"

    local audio
    audio=$(find source/audio -type f 2>/dev/null | wc -l)
    echo -e "${CYAN}Audio files:${NC} $audio"

    # Disk usage
    if command -v du &>/dev/null; then
        echo -e "${CYAN}Source size:${NC} $(du -sh source/ 2>/dev/null | cut -f1)"
        echo -e "${CYAN}Deploy size:${NC} $(du -sh .deploy_git/ 2>/dev/null | cut -f1 || echo 'N/A')"
        echo -e "${CYAN}Public size:${NC} $(du -sh public/ 2>/dev/null | cut -f1 || echo 'N/A')"
    fi

    # Data files
    echo ""
    info "Data files:"
    for f in source/data/*.json source/data/*.yml source/data/*.yaml; do
        [ -f "$f" ] && echo "  $(basename "$f") ($(wc -c < "$f") bytes)"
    done
    for f in source/_data/*.json source/_data/*.yml source/_data/*.yaml; do
        [ -f "$f" ] && echo "  _data/$(basename "$f") ($(wc -c < "$f") bytes)"
    done

    echo ""
}

do_clean() {
    info "Cleaning..."
    $HEXO_CMD clean
    ok "Clean complete"
}

do_generate() {
    info "Generating..."
    $HEXO_CMD generate
    ok "Generate complete"

    if [ -d "public" ]; then
        local size
        size=$(du -sh public/ 2>/dev/null | cut -f1)
        info "Public directory: $size"
    fi
}

do_preview() {
    info "Starting local preview on http://localhost:$PREVIEW_PORT"
    info "Press Ctrl+C to stop preview and continue to deploy"
    echo ""
    $HEXO_CMD server -p "$PREVIEW_PORT" || true
    echo ""
}

do_deploy() {
    info "Deploying..."
    $HEXO_CMD deploy
    ok "Deploy complete! Site should be live at https://yetbye.top"
    echo ""
    info "Note: GitHub Pages may take 1-2 minutes to update."
}

# --- Main ---
SKIP_PREVIEW=false
CLEAN_ONLY=false
BUILD_ONLY=false
STATUS_ONLY=false

# Parse arguments
for arg in "$@"; do
    case "$arg" in
        --skip-preview) SKIP_PREVIEW=true ;;
        --clean-only)   CLEAN_ONLY=true ;;
        --build-only)   BUILD_ONLY=true ;;
        --status)       STATUS_ONLY=true ;;
        --port=*)
            PREVIEW_PORT="${arg#*=}"
            if ! echo "$PREVIEW_PORT" | grep -qE '^[0-9]+$' || [ "$PREVIEW_PORT" -lt 1 ] || [ "$PREVIEW_PORT" -gt 65535 ]; then
                err "Invalid port: $PREVIEW_PORT (must be 1-65535)"
                exit 1
            fi
            ;;
        --help|-h)
            echo "Usage: ./deploy.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --skip-preview   Skip local preview, deploy directly"
            echo "  --clean-only     Only clean, no build or deploy"
            echo "  --build-only     Clean + generate, no deploy"
            echo "  --status         Show project status summary"
            echo "  --port=PORT      Set preview port (default: 4000)"
            echo "  --help           Show this help"
            exit 0
            ;;
        *)
            warn "Unknown argument: $arg"
            ;;
    esac
done

echo ""
echo "================================"
echo "  Hexo Deploy — OwnWeb-Yetbye"
echo "================================"
echo ""

check_env

if $STATUS_ONLY; then
    show_status
    exit 0
fi

if $CLEAN_ONLY; then
    do_clean
    exit 0
fi

do_clean
do_generate

if $BUILD_ONLY; then
    ok "Build complete (no deploy)"
    exit 0
fi

if ! $SKIP_PREVIEW; then
    do_preview
fi

do_deploy

show_status
ok "All done!"
