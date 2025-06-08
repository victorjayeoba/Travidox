const fs = require('fs');
const path = require('path');

// List of Windows-specific dependencies to remove
const windowsDeps = [
  '@next/swc-win32-x64-msvc',
  '@next/swc-win32-ia32-msvc',
  '@next/swc-win32-arm64-msvc'
];

// Path to node_modules
const nodeModulesPath = path.join(__dirname, 'node_modules');

// Check if directory exists
if (fs.existsSync(nodeModulesPath)) {
  windowsDeps.forEach(dep => {
    const depPath = path.join(nodeModulesPath, dep);
    if (fs.existsSync(depPath)) {
      console.log(`Removing Windows-specific dependency: ${dep}`);
      fs.rmSync(depPath, { recursive: true, force: true });
    }
  });
  console.log('Cleanup completed successfully!');
} else {
  console.log('node_modules directory not found. No cleanup needed.');
} 