// Script wrapper que se ejecuta desde la raíz del proyecto
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Obtener el directorio raíz del proyecto (donde está este script)
const projectRoot = path.resolve(__dirname, '..');

// Cambiar al directorio raíz
process.chdir(projectRoot);

// Ejecutar el script de copia
const copyScript = path.join(__dirname, 'copy-dist.js');

if (fs.existsSync(copyScript)) {
  console.log(`Executing copy script from: ${projectRoot}`);
  require(copyScript);
} else {
  console.error(`Copy script not found at: ${copyScript}`);
  process.exit(1);
}

