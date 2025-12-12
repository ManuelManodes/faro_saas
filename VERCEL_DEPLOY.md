# 🚀 Guía Completa de Despliegue en Vercel

Este proyecto está configurado para desplegarse en Vercel con un frontend React/Vite y un backend NestJS.

## 📋 Estructura del Proyecto

- **Frontend**: `client/` - Aplicación React con Vite
- **Backend**: `server/` - API NestJS
- **Handler Vercel**: `api/index.ts` - Función serverless para el backend

---

## 🎯 MÉTODO 1: Despliegue desde GitHub (Recomendado)

### Paso 1: Preparar el Repositorio

1. **Asegúrate de que tu código esté en GitHub**:
   ```bash
   # Si aún no tienes un repositorio
   git init
   git add .
   git commit -m "Initial commit - Ready for Vercel"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/tu-repositorio.git
   git push -u origin main
   ```

2. **Verifica que todos los archivos estén incluidos**:
   - ✅ `vercel.json` (en la raíz)
   - ✅ `api/index.ts` (en la raíz)
   - ✅ `package.json` (en la raíz con workspaces)
   - ✅ `client/package.json`
   - ✅ `server/package.json`

### Paso 2: Conectar con Vercel

1. **Ve a [vercel.com](https://vercel.com)** e inicia sesión (puedes usar GitHub)

2. **Haz clic en "Add New Project"**

3. **Importa tu repositorio de GitHub**:
   - Selecciona el repositorio desde la lista
   - Si no aparece, autoriza a Vercel para acceder a tus repositorios

4. **Vercel detectará automáticamente la configuración**:
   - Framework Preset: Other
   - Root Directory: `./` (raíz del proyecto)
   - Build Command: `npm run build` (ya configurado en vercel.json)
   - Output Directory: `client/dist` (ya configurado en vercel.json)

### Paso 3: Configurar Variables de Entorno

**Antes de hacer el deploy**, configura las variables de entorno:

1. En la pantalla de configuración del proyecto, ve a la sección **"Environment Variables"**

2. **Agrega las siguientes variables**:

   | Variable | Valor | Descripción |
   |----------|-------|-------------|
   | `MONGODB_URI` | `mongodb+srv://usuario:password@cluster.mongodb.net/database` | URI de conexión a MongoDB (obligatorio) |
   | `ALLOWED_ORIGINS` | `https://tu-proyecto.vercel.app` | Orígenes permitidos para CORS (opcional, separados por comas) |
   | `NODE_ENV` | `production` | Entorno de ejecución (opcional, Vercel lo establece automáticamente) |

   **Ejemplo de MONGODB_URI**:
   ```
   mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/faro_v2?retryWrites=true&w=majority
   ```

   **Ejemplo de ALLOWED_ORIGINS** (múltiples dominios):
   ```
   https://tu-proyecto.vercel.app,https://www.tu-dominio.com,https://tu-dominio.com
   ```

3. **Selecciona los ambientes** donde aplicar las variables:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (opcional)

### Paso 4: Realizar el Despliegue

1. **Haz clic en "Deploy"**

2. **Espera a que termine el build** (puede tardar 2-5 minutos):
   - Verás el progreso en tiempo real
   - Vercel instalará dependencias
   - Compilará el frontend (React/Vite)
   - Preparará las funciones serverless

3. **Una vez completado**, verás:
   - ✅ URL de producción: `https://tu-proyecto.vercel.app`
   - ✅ URL de preview (si aplica)

### Paso 5: Verificar el Despliegue

1. **Visita la URL de producción**

2. **Prueba el frontend**:
   - Navega por las diferentes páginas
   - Verifica que el routing funcione

3. **Prueba la API**:
   - Visita: `https://tu-proyecto.vercel.app/api`
   - Deberías ver la respuesta del endpoint raíz

4. **Revisa los logs** (si hay errores):
   - Ve a "Deployments" → Selecciona el deployment → "Functions" → Revisa los logs

---

## 🖥️ MÉTODO 2: Despliegue desde CLI

### Paso 1: Instalar Vercel CLI

```bash
npm i -g vercel
```

**Verifica la instalación**:
```bash
vercel --version
```

### Paso 2: Iniciar Sesión

```bash
vercel login
```

Esto abrirá tu navegador para autenticarte. Sigue las instrucciones.

### Paso 3: Configurar Variables de Entorno (Opcional - Primera vez)

Puedes configurar las variables desde la CLI o desde el dashboard:

```bash
# Configurar MONGODB_URI
vercel env add MONGODB_URI production

# Configurar ALLOWED_ORIGINS
vercel env add ALLOWED_ORIGINS production

# Ver todas las variables
vercel env ls
```

**O mejor aún**, configúralas desde el dashboard de Vercel (más fácil).

### Paso 4: Desplegar

**Para preview/staging**:
```bash
vercel
```

**Para producción**:
```bash
vercel --prod
```

**Sigue las instrucciones**:
- Set up and deploy? **Y**
- Which scope? (selecciona tu cuenta)
- Link to existing project? **N** (primera vez) o **Y** (si ya existe)
- Project name? (deja el nombre por defecto o elige uno)
- Directory? **./** (raíz del proyecto)

### Paso 5: Verificar

El CLI te dará la URL del deployment. Visítala y verifica que todo funcione.

---

## 🔧 Configuración Post-Despliegue

### Agregar Variables de Entorno Después del Despliegue

1. Ve al dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega/edita las variables necesarias
5. **Importante**: Haz un nuevo deploy para que los cambios surtan efecto

### Configurar Dominio Personalizado

1. Ve a **Settings** → **Domains**
2. Agrega tu dominio
3. Sigue las instrucciones para configurar los DNS

---

## 📝 Estructura de Rutas

- **Frontend**: Todas las rutas excepto `/api/*` se sirven desde el frontend
- **Backend**: Todas las rutas `/api/*` se dirigen a la función serverless
- **SPA Routing**: Todas las rutas del frontend se reescriben a `/index.html` para React Router

## Estructura de Rutas

- **Frontend**: Todas las rutas excepto `/api/*` se sirven desde el frontend
- **Backend**: Todas las rutas `/api/*` se dirigen a la función serverless

---

## ⚠️ Notas Importantes

1. **Caché del Handler**: El handler en `api/index.ts` usa caché para mejorar el rendimiento en funciones serverless
2. **Swagger**: Solo está disponible en desarrollo (no en producción por seguridad)
3. **MongoDB**: Asegúrate de que MongoDB esté accesible desde los servidores de Vercel (whitelist de IPs o conexión sin restricciones)
4. **Build Directory**: El build del frontend se genera en `client/dist/`
5. **Workspaces**: El proyecto usa npm workspaces, Vercel los maneja automáticamente

---

## 🔍 Solución de Problemas

### ❌ Error: "Cannot find module"

**Causa**: Dependencias faltantes o problemas con workspaces

**Solución**:
```bash
# Limpia node_modules y reinstala
rm -rf node_modules client/node_modules server/node_modules
npm install

# Verifica que el package.json tenga workspaces configurados
# Debería tener: "workspaces": ["client", "server"]
```

### ❌ Error: "Function Timeout"

**Causa**: La función serverless excede el tiempo límite (30 segundos)

**Solución**:
- Optimiza consultas a la base de datos
- Usa índices en MongoDB
- Considera aumentar `maxDuration` en `vercel.json` (máximo 60s en plan Hobby)
- Implementa paginación para consultas grandes

### ❌ Error: "CORS policy: No 'Access-Control-Allow-Origin'"

**Causa**: Configuración incorrecta de CORS

**Solución**:
1. Verifica que `ALLOWED_ORIGINS` esté configurado correctamente
2. Asegúrate de incluir el dominio de Vercel: `https://tu-proyecto.vercel.app`
3. Si usas un dominio personalizado, agrégalo también

### ❌ Error: "MongoDB connection failed"

**Causa**: URI incorrecta o MongoDB no accesible

**Solución**:
1. Verifica la URI de MongoDB en las variables de entorno
2. En MongoDB Atlas, ve a **Network Access** y agrega `0.0.0.0/0` (todas las IPs) o las IPs de Vercel
3. Verifica que el usuario tenga permisos de lectura/escritura

### ❌ Error: "Build failed"

**Causa**: Errores de compilación en el frontend o backend

**Solución**:
1. Revisa los logs del build en Vercel
2. Prueba el build localmente:
   ```bash
   npm run build
   ```
3. Verifica que no haya errores de TypeScript:
   ```bash
   cd client && npm run build
   cd ../server && npm run build
   ```

### ❌ Error: "404 Not Found" en rutas del frontend

**Causa**: Problema con el routing de React Router

**Solución**:
- Verifica que `vercel.json` tenga el rewrite correcto:
  ```json
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
  ```

### ❌ Error: "API returns 404"

**Causa**: La función serverless no se está ejecutando correctamente

**Solución**:
1. Verifica que `api/index.ts` exista en la raíz del proyecto
2. Revisa los logs de la función en Vercel: **Deployments** → **Functions** → **Logs**
3. Asegúrate de que las rutas en NestJS estén correctamente configuradas

---

## 📊 Verificación del Despliegue

### Checklist Post-Despliegue

- [ ] Frontend carga correctamente
- [ ] Las rutas del frontend funcionan (navegación)
- [ ] La API responde en `/api`
- [ ] Las variables de entorno están configuradas
- [ ] MongoDB se conecta correctamente
- [ ] No hay errores en los logs de Vercel
- [ ] CORS funciona correctamente

### Comandos Útiles

```bash
# Ver deployments
vercel ls

# Ver logs en tiempo real
vercel logs

# Ver información del proyecto
vercel inspect

# Eliminar un deployment
vercel rm <deployment-url>
```

---

## 🎉 ¡Listo!

Tu proyecto debería estar funcionando en Vercel. Si encuentras algún problema, revisa los logs en el dashboard de Vercel o consulta la documentación oficial: [vercel.com/docs](https://vercel.com/docs)

