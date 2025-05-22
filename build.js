#!/usr/bin/env node

/**
 * Build script for Vue Form Builder
 * This script prepares the package for distribution
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

console.log(`${colors.bright}${colors.blue}════════════════════════════════════════${colors.reset}`);
console.log(`${colors.bright}${colors.blue}       Vue Form Builder - Build         ${colors.reset}`);
console.log(`${colors.bright}${colors.blue}════════════════════════════════════════${colors.reset}\n`);

// Ensure the dist directory exists
const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
  console.log(`${colors.green}✓ Created dist directory${colors.reset}`);
}

try {
  // Clean previous builds
  console.log(`${colors.yellow}Cleaning previous builds...${colors.reset}`);
  execSync('rm -rf dist/*.js dist/*.css', { stdio: 'inherit' });
  
  // Run tests
  console.log(`\n${colors.yellow}Running tests...${colors.reset}`);
  execSync('npm run test', { stdio: 'inherit' });
  
  // Build the library
  console.log(`\n${colors.yellow}Building library...${colors.reset}`);
  execSync('npm run build', { stdio: 'inherit' });
  
  // Copy additional files to dist
  console.log(`\n${colors.yellow}Copying files to dist...${colors.reset}`);
  
  // Copy package.json but with modified content
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  
  // Remove development-specific properties
  delete packageJson.devDependencies;
  delete packageJson.scripts.dev;
  delete packageJson.scripts.test;
  delete packageJson.scripts['test:watch'];
  
  // Write the modified package.json to dist
  fs.writeFileSync(
    path.join(distDir, 'package.json'), 
    JSON.stringify(packageJson, null, 2)
  );
  
  // Copy README.md to dist
  fs.copyFileSync(
    path.join(process.cwd(), 'README.md'),
    path.join(distDir, 'README.md')
  );
  
  // Copy LICENSE to dist
  fs.copyFileSync(
    path.join(process.cwd(), 'LICENSE'),
    path.join(distDir, 'LICENSE')
  );
  
  console.log(`\n${colors.green}${colors.bright}Build completed successfully!${colors.reset}`);
  console.log(`\nThe compiled output is in the ${colors.bright}dist/${colors.reset} directory.`);
  console.log(`\nTo publish the package, run: ${colors.bright}npm publish dist/${colors.reset}`);
  
} catch (error) {
  console.error(`\n${colors.red}Build failed:${colors.reset}`, error.message);
  process.exit(1);
}
