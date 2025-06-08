const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript and JavaScript files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.next' && file !== '.git') {
      findFiles(filePath, fileList);
    } else if (
      stat.isFile() && 
      (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'))
    ) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Create symbolic links for potentially missing directories
function createSymlinks() {
  const directories = [
    { from: 'components', to: 'travidox_frontend/components' },
    { from: 'hooks', to: 'travidox_frontend/hooks' },
    { from: 'lib', to: 'travidox_frontend/lib' }
  ];
  
  directories.forEach(({ from, to }) => {
    try {
      if (!fs.existsSync(from) && fs.existsSync(to)) {
        console.log(`Creating symlink from ${from} to ${to}`);
        fs.symlinkSync(to, from, 'dir');
      }
    } catch (error) {
      console.error(`Error creating symlink for ${from}:`, error);
    }
  });
}

// Fix imports in all files
function fixImports() {
  const files = findFiles('.');
  let fixedCount = 0;
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
    // Replace imports from @/ with relative paths
    content = content.replace(
      /from\s+['"]@\/([^'"]+)['"]/g, 
      (match, importPath) => {
        return `from './${importPath}'`;
      }
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      fixedCount++;
      console.log(`Fixed imports in ${file}`);
    }
  });
  
  console.log(`Fixed imports in ${fixedCount} files`);
}

// Main
console.log('Starting import fix process...');
createSymlinks();
fixImports();
console.log('Import fix process completed.'); 