#!/bin/bash
# Script que encuentra la raíz del proyecto y ejecuta copy-dist.js
# Funciona desde cualquier directorio

# Encontrar la ubicación de este script
# BASH_SOURCE[0] es la ruta del script actual, incluso cuando se ejecuta con source
SCRIPT_PATH="${BASH_SOURCE[0]}"
if [ -z "$SCRIPT_PATH" ]; then
  SCRIPT_PATH="$0"
fi

# Obtener el directorio absoluto del script
SCRIPT_DIR="$( cd "$( dirname "$SCRIPT_PATH" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "Script path: $SCRIPT_PATH"
echo "Script directory: $SCRIPT_DIR"
echo "Project root: $PROJECT_ROOT"
echo "Current directory: $(pwd)"

# Cambiar al directorio raíz
cd "$PROJECT_ROOT" || {
  echo "Error: Could not change to project root: $PROJECT_ROOT"
  exit 1
}

echo "Changed to: $(pwd)"

# Verificar que el script de Node.js existe
COPY_SCRIPT="$SCRIPT_DIR/copy-dist.js"
if [ ! -f "$COPY_SCRIPT" ]; then
  echo "Error: Copy script not found at: $COPY_SCRIPT"
  exit 1
fi

# Ejecutar el script de Node.js
echo "Executing: node $COPY_SCRIPT"
node "$COPY_SCRIPT"

