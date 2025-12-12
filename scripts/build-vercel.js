// Script wrapper que se ejecuta desde cualquier directorio
const path = require('path');
const fs = require('fs');

// Obtener el directorio raíz del proyecto (donde está este script)
// __dirname siempre apunta a donde está este archivo (scripts/)
const projectRoot = path.resolve(__dirname, '..');
const currentDir = process.cwd();

console.log(`Current working directory: ${currentDir}`);
console.log(`Script location (__dirname): ${__dirname}`);
console.log(`Project root: ${projectRoot}`);

// Cambiar al directorio raíz
process.chdir(projectRoot);
console.log(`Changed to project root: ${process.cwd()}`);

// Ejecutar el script de copia
const copyScript = path.join(__dirname, 'copy-dist.js');

if (fs.existsSync(copyScript)) {
  console.log(`Executing copy script: ${copyScript}`);
  require(copyScript);
} else {
  console.error(`Copy script not found at: ${copyScript}`);
  console.error(`Current directory: ${process.cwd()}`);
  console.error(`__dirname: ${__dirname}`);
  process.exit(1);
}

