const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  try {
    const exists = fs.existsSync(src);
    if (!exists) {
      console.error(`Source path does not exist: ${src}`);
      return false;
    }
    
    const stats = fs.statSync(src);
    const isDirectory = stats.isDirectory();

    if (isDirectory) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const files = fs.readdirSync(src);
      files.forEach(childItemName => {
        copyRecursiveSync(
          path.join(src, childItemName),
          path.join(dest, childItemName)
        );
      });
    } else {
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(src, dest);
    }
    return true;
  } catch (error) {
    console.error(`Error copying ${src} to ${dest}:`, error.message);
    return false;
  }
}

// Copiar client/dist a dist en la raíz
const sourceDir = path.join(__dirname, '../client/dist');
const destDir = path.join(__dirname, '../dist');

console.log('Starting copy process...');
console.log(`Source: ${sourceDir}`);
console.log(`Destination: ${destDir}`);

if (fs.existsSync(sourceDir)) {
  // Limpiar destino si existe
  if (fs.existsSync(destDir)) {
    console.log('Cleaning existing dist directory...');
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  
  console.log(`Copying ${sourceDir} to ${destDir}...`);
  const success = copyRecursiveSync(sourceDir, destDir);
  
  if (success) {
    console.log('Copy completed successfully!');
    process.exit(0);
  } else {
    console.error('Copy failed!');
    process.exit(1);
  }
} else {
  console.error(`Source directory ${sourceDir} does not exist!`);
  console.error('Make sure the client build completed successfully.');
  process.exit(1);
}

