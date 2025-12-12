#!/bin/bash
# Script que encuentra la raíz del proyecto y ejecuta copy-dist.js
# Funciona desde cualquier directorio

# Encontrar el directorio raíz (donde está package.json)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "Script directory: $SCRIPT_DIR"
echo "Project root: $PROJECT_ROOT"
echo "Current directory: $(pwd)"

# Cambiar al directorio raíz
cd "$PROJECT_ROOT"

# Ejecutar el script de Node.js
node scripts/copy-dist.js

