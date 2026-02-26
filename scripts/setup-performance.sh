#!/bin/bash

# Performance Optimization Setup Script
# This script installs dependencies and verifies the performance setup

set -e

echo "🚀 CDE Performance Optimization Setup"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo -e "${BLUE}Checking Node.js version...${NC}"
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${YELLOW}Warning: Node.js 20+ recommended (current: $(node -v))${NC}"
else
    echo -e "${GREEN}✓ Node.js version OK: $(node -v)${NC}"
fi
echo ""

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Install Lighthouse CI
echo -e "${BLUE}Installing Lighthouse CI...${NC}"
npm install --save-dev @lhci/cli@^0.13.0
echo -e "${GREEN}✓ Lighthouse CI installed${NC}"
echo ""

# Verify files
echo -e "${BLUE}Verifying performance files...${NC}"

FILES=(
    "src/scripts/utilities/lazy-loader.ts"
    "src/scripts/utilities/indexeddb-manager.ts"
    "src/scripts/utilities/virtual-scroller.ts"
    "src/scripts/core/performance-monitor.ts"
    "src/scripts/core/performance-integration.ts"
    "src/scripts/workers/xpm-worker.ts"
    "src/scripts/workers/vfs-worker.ts"
    "lighthouserc.json"
    ".github/workflows/lighthouse-ci.yml"
    "docs/PERFORMANCE.md"
    "README-PERFORMANCE.md"
)

MISSING=0
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${YELLOW}✗${NC} $file (missing)"
        MISSING=$((MISSING + 1))
    fi
done

echo ""

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✓ All performance files present${NC}"
else
    echo -e "${YELLOW}⚠ $MISSING files missing${NC}"
fi

echo ""

# Build project
echo -e "${BLUE}Building project...${NC}"
npm run build
echo -e "${GREEN}✓ Build successful${NC}"
echo ""

# Run Lighthouse (optional)
echo -e "${BLUE}Run Lighthouse CI now? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${BLUE}Running Lighthouse CI...${NC}"
    npm run lighthouse || echo -e "${YELLOW}Lighthouse failed (this is normal if preview server isn't running)${NC}"
else
    echo -e "${YELLOW}Skipping Lighthouse CI${NC}"
fi

echo ""
echo "======================================"
echo -e "${GREEN}✓ Performance setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Start dev server: npm run dev"
echo "  2. Check metrics in console: await logPerformanceReport()"
echo "  3. Run analysis: npm run perf:analyze"
echo "  4. Read docs: docs/PERFORMANCE.md"
echo ""
echo "Happy optimizing! 🚀"
