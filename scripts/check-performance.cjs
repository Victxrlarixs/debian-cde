#!/usr/bin/env node

/**
 * Performance Check Script
 * Verifies that all performance optimizations are properly configured
 */

const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

console.log(`${BLUE}🚀 CDE Performance Check${RESET}`);
console.log('='.repeat(50));
console.log('');

let errors = 0;
let warnings = 0;

// Check required files
const requiredFiles = [
  'src/scripts/utilities/lazy-loader.ts',
  'src/scripts/utilities/indexeddb-manager.ts',
  'src/scripts/utilities/virtual-scroller.ts',
  'src/scripts/core/performance-monitor.ts',
  'src/scripts/core/performance-integration.ts',
  'src/scripts/workers/xpm-worker.ts',
  'src/scripts/workers/vfs-worker.ts',
  'docs/PERFORMANCE.md',
];

console.log(`${BLUE}Checking required files...${RESET}`);
requiredFiles.forEach((file) => {
  const exists = fs.existsSync(file);
  if (exists) {
    console.log(`${GREEN}✓${RESET} ${file}`);
  } else {
    console.log(`${RED}✗${RESET} ${file} (missing)`);
    errors++;
  }
});
console.log('');

// Check package.json
console.log(`${BLUE}Checking package.json...${RESET}`);
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredScripts = {
  dev: 'astro dev',
  build: 'astro build',
};

Object.entries(requiredScripts).forEach(([name, command]) => {
  if (packageJson.scripts[name]) {
    console.log(`${GREEN}✓${RESET} Script "${name}" exists`);
  } else {
    console.log(`${RED}✗${RESET} Script "${name}" missing`);
    errors++;
  }
});
console.log('');

// Check TypeScript configuration
console.log(`${BLUE}Checking TypeScript configuration...${RESET}`);
if (fs.existsSync('tsconfig.json')) {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  console.log(`${GREEN}✓${RESET} tsconfig.json exists`);
  
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.target) {
    console.log(`${GREEN}✓${RESET} Target: ${tsconfig.compilerOptions.target}`);
  }
} else {
  console.log(`${YELLOW}⚠${RESET} tsconfig.json missing`);
  warnings++;
}
console.log('');

// Check documentation
console.log(`${BLUE}Checking documentation...${RESET}`);
const docs = [
  'docs/PERFORMANCE.md',
  'README-PERFORMANCE.md',
  'CHANGELOG-PERFORMANCE.md',
];

docs.forEach((doc) => {
  if (fs.existsSync(doc)) {
    const content = fs.readFileSync(doc, 'utf8');
    const lines = content.split('\n').length;
    console.log(`${GREEN}✓${RESET} ${doc} (${lines} lines)`);
  } else {
    console.log(`${YELLOW}⚠${RESET} ${doc} missing`);
    warnings++;
  }
});
console.log('');

// Summary
console.log('='.repeat(50));
if (errors === 0 && warnings === 0) {
  console.log(`${GREEN}✓ All checks passed!${RESET}`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. npm run dev');
  console.log('  2. Open console and run: await logPerformanceReport()');
  console.log('  3. Test lazy loading and virtual scrolling');
  process.exit(0);
} else {
  if (errors > 0) {
    console.log(`${RED}✗ ${errors} error(s) found${RESET}`);
  }
  if (warnings > 0) {
    console.log(`${YELLOW}⚠ ${warnings} warning(s) found${RESET}`);
  }
  console.log('');
  console.log('Please fix the issues above before proceeding.');
  process.exit(errors > 0 ? 1 : 0);
}
