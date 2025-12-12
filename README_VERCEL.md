# 🚀 Proyecto Listo para Vercel

Este proyecto está completamente configurado y listo para desplegarse en Vercel.

## ✅ Configuración Completada

- ✅ `vercel.json` - Configuración de Vercel
- ✅ `api/index.ts` - Handler serverless para NestJS
- ✅ `.npmrc` - Configuración de npm workspaces
- ✅ `api/tsconfig.json` - Configuración TypeScript para el handler
- ✅ `.vercelignore` - Archivos excluidos del deploy

## 📦 Estructura del Proyecto

```
faro_v2/
├── client/          # Frontend React/Vite
├── server/          # Backend NestJS
├── api/             # Handler serverless para Vercel
├── vercel.json      # Configuración de Vercel
└── package.json     # Workspaces configurados
```

## 🚀 Despliegue Rápido

### Opción 1: Desde GitHub (Recomendado)

1. **Sube tu código a GitHub** (si aún no lo has hecho)
2. **Ve a [vercel.com](https://vercel.com)** e inicia sesión
3. **Haz clic en "Add New Project"**
4. **Importa tu repositorio de GitHub**
5. **Configura las variables de entorno** (ver `ENV_VARIABLES.md`)
6. **Haz clic en "Deploy"**

### Opción 2: Desde CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Iniciar sesión
vercel login

# 3. Desplegar
vercel --prod
```

## 🔐 Variables de Entorno Necesarias

**Antes de desplegar**, configura estas variables en Vercel:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `ALLOWED_ORIGINS` | Orígenes CORS (opcional) | `https://tu-proyecto.vercel.app` |

Ver `ENV_VARIABLES.md` para más detalles.

## 📚 Documentación Completa

- **`VERCEL_DEPLOY.md`** - Guía completa paso a paso
- **`DEPLOY_CHECKLIST.md`** - Checklist de verificación
- **`ENV_VARIABLES.md`** - Configuración de variables de entorno

## 🧪 Verificación Local (Opcional)

Antes de desplegar, puedes verificar que el build funciona:

```bash
# Instalar dependencias
npm install

# Build del proyecto
npm run build

# Verificar que se generó client/dist
ls -la client/dist
```

## 🎯 Rutas del Proyecto

- **Frontend**: `https://tu-proyecto.vercel.app/`
- **API**: `https://tu-proyecto.vercel.app/api`
- **API Docs** (solo desarrollo): `https://tu-proyecto.vercel.app/api/docs`

## ⚠️ Notas Importantes

1. **MongoDB**: Asegúrate de configurar Network Access en MongoDB Atlas para permitir conexiones desde Vercel
2. **Build Time**: El primer deploy puede tardar 3-5 minutos
3. **Variables de Entorno**: Después de agregar variables, haz un nuevo deploy
4. **Workspaces**: Vercel maneja automáticamente los npm workspaces

## 🆘 Problemas Comunes

Si encuentras problemas, consulta la sección de "Solución de Problemas" en `VERCEL_DEPLOY.md`.

---

**¡Tu proyecto está listo para desplegarse! 🎉**


