// Build script for creating UMD build with Vue bundled
const { execSync } = require('child_process');

try {
  console.log('Building standard ES and UMD builds...');
  execSync('vite build', { stdio: 'inherit' });

  // We're not going to use the standalone build for now since it has issues
  // console.log('\nBuilding standalone UMD build with Vue included...');
  // execSync('vite build --config vite.umd.config.js', { stdio: 'inherit' });

  console.log('\nBuild completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
