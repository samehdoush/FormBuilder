#!/usr/bin/env node

/**
 * This script helps with publishing the package to NPM
 * It ensures tests pass and builds are successful before publishing
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ensure we're in the root directory of the package
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('Error: package.json not found. Please run this script from the root directory of the package.');
  process.exit(1);
}

// Read the current version from package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

console.log(`Current version: ${currentVersion}`);

// Ask for the new version
rl.question('Enter new version (leave blank to use current version): ', (newVersion) => {
  newVersion = newVersion.trim() || currentVersion;
  
  // Update version in package.json
  if (newVersion !== currentVersion) {
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`Updated version to ${newVersion}`);
  }
  
  try {
    // Run tests
    console.log('\nRunning tests...');
    execSync('npm run test', { stdio: 'inherit' });
    
    // Build the package
    console.log('\nBuilding package...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Ask for confirmation before publishing
    rl.question(`\nReady to publish vue-form-builder@${newVersion}. Continue? (y/n): `, (answer) => {
      if (answer.toLowerCase() === 'y') {
        try {
          console.log('\nPublishing package...');
          execSync('npm publish', { stdio: 'inherit' });
          console.log(`\nSuccessfully published vue-form-builder@${newVersion}`);
        } catch (error) {
          console.error('Error publishing package:', error.message);
        }
      } else {
        console.log('Publication canceled');
      }
      rl.close();
    });
  } catch (error) {
    console.error('Error:', error.message);
    rl.close();
  }
});
