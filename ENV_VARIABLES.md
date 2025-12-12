# Variables de Entorno para Vercel

Configura estas variables en el dashboard de Vercel (Settings → Environment Variables):

## Variables Requeridas

### MONGODB_URI
**Obligatorio** - URI de conexión a MongoDB

**Ejemplo para MongoDB Atlas:**
```
mongodb+srv://usuario:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Ejemplo para MongoDB local:**
```
mongodb://localhost:27017/edusaas
```

## Variables Opcionales

### ALLOWED_ORIGINS
Orígenes permitidos para CORS (separados por comas)

**Ejemplo:**
```
https://tu-proyecto.vercel.app,https://www.tu-dominio.com,https://tu-dominio.com
```

**Por defecto:** `*` (permite todos los orígenes)

### NODE_ENV
Entorno de ejecución. Vercel lo establece automáticamente como `production` en producción.

**Valores posibles:**
- `production` (automático en Vercel)
- `development` (automático en preview)

## Cómo Configurar en Vercel

1. Ve a tu proyecto en [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Haz clic en **Add New**
5. Ingresa el nombre y valor de la variable
6. Selecciona los ambientes donde aplicará:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (opcional)
7. Haz clic en **Save**
8. **Importante:** Haz un nuevo deploy para que los cambios surtan efecto

## Notas Importantes

- Las variables de entorno son sensibles, no las compartas públicamente
- MongoDB Atlas requiere configurar Network Access para permitir conexiones desde Vercel (0.0.0.0/0 o IPs específicas)
- Después de agregar/modificar variables, siempre haz un nuevo deploy

