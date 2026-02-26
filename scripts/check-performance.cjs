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
  'lighthouserc.json',
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
  lighthouse: 'lhci autorun',
  'perf:analyze': 'astro build && npm run lighthouse',
};

Object.entries(requiredScripts).forEach(([name, command]) => {
  if (packageJson.scripts[name]) {
    console.log(`${GREEN}✓${RESET} Script "${name}" exists`);
  } else {
    console.log(`${RED}✗${RESET} Script "${name}" missing`);
    errors++;
  }
});

if (packageJson.devDependencies['@lhci/cli']) {
  console.log(`${GREEN}✓${RESET} Lighthouse CI dependency installed`);
} else {
  console.log(`${YELLOW}⚠${RESET} Lighthouse CI dependency missing (run: npm install --save-dev @lhci/cli)`);
  warnings++;
}
console.log('');

// Check Lighthouse config
console.log(`${BLUE}Checking Lighthouse configuration...${RESET}`);
if (fs.existsSync('lighthouserc.json')) {
  const config = JSON.parse(fs.readFileSync('lighthouserc.json', 'utf8'));
  
  if (config.ci && config.ci.collect && config.ci.assert) {
    console.log(`${GREEN}✓${RESET} Lighthouse config valid`);
    
    const assertions = config.ci.assert.assertions;
    const performanceScore = assertions['categories:performance'];
    if (performanceScore && performanceScore[1].minScore >= 0.85) {
      console.log(`${GREEN}✓${RESET} Performance threshold: ${performanceScore[1].minScore * 100}%`);
    } else {
      console.log(`${YELLOW}⚠${RESET} Performance threshold too low or missing`);
      warnings++;
    }
  } else {
    console.log(`${RED}✗${RESET} Lighthouse config incomplete`);
    errors++;
  }
} else {
  console.log(`${RED}✗${RESET} lighthouserc.json missing`);
  errors++;
}
console.log('');

// Check GitHub Actions
console.log(`${BLUE}Checking GitHub Actions...${RESET}`);
const workflowPath = '.github/workflows/lighthouse-ci.yml';
if (fs.existsSync(workflowPath)) {
  console.log(`${GREEN}✓${RESET} Lighthouse CI workflow exists`);
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  if (workflow.includes('lighthouse-ci-action')) {
    console.log(`${GREEN}✓${RESET} Workflow uses lighthouse-ci-action`);
  } else {
    console.log(`${YELLOW}⚠${RESET} Workflow may be misconfigured`);
    warnings++;
  }
} else {
  console.log(`${YELLOW}⚠${RESET} Lighthouse CI workflow missing (optional)`);
  warnings++;
}
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
  console.log('  3. npm run perf:analyze');
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
