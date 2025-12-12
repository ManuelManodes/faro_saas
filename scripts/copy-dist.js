const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copiar client/dist a dist en la raíz
const sourceDir = path.join(__dirname, '../client/dist');
const destDir = path.join(__dirname, '../dist');

if (fs.existsSync(sourceDir)) {
  console.log(`Copying ${sourceDir} to ${destDir}...`);
  copyRecursiveSync(sourceDir, destDir);
  console.log('Copy completed successfully!');
} else {
  console.error(`Source directory ${sourceDir} does not exist!`);
  process.exit(1);
}

