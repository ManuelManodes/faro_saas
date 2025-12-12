# ✅ Checklist de Despliegue en Vercel

## 📋 Pre-Despliegue

- [ ] Código subido a GitHub
- [ ] `vercel.json` existe en la raíz del proyecto
- [ ] `api/index.ts` existe en la raíz del proyecto
- [ ] `package.json` tiene workspaces configurados
- [ ] Build local funciona: `npm run build`

## 🔐 Variables de Entorno

Configura estas variables en Vercel (Settings → Environment Variables):

- [ ] `MONGODB_URI` - URI de conexión a MongoDB
- [ ] `ALLOWED_ORIGINS` - Dominios permitidos (opcional)
- [ ] `NODE_ENV` - `production` (opcional, Vercel lo establece automáticamente)

## 🚀 Despliegue

### Opción A: Desde GitHub (Recomendado)
- [ ] Repositorio conectado con Vercel
- [ ] Variables de entorno configuradas
- [ ] Primer deploy realizado
- [ ] URL de producción obtenida

### Opción B: Desde CLI
- [ ] Vercel CLI instalado: `npm i -g vercel`
- [ ] Sesión iniciada: `vercel login`
- [ ] Variables de entorno configuradas
- [ ] Deploy realizado: `vercel --prod`

## ✅ Verificación Post-Despliegue

- [ ] Frontend carga: `https://tu-proyecto.vercel.app`
- [ ] API responde: `https://tu-proyecto.vercel.app/api`
- [ ] Rutas del frontend funcionan (navegación)
- [ ] Conexión a MongoDB funciona
- [ ] No hay errores en los logs de Vercel
- [ ] CORS funciona correctamente

## 🔧 MongoDB Atlas (Si aplica)

- [ ] Cluster creado
- [ ] Usuario de base de datos creado
- [ ] Network Access configurado (0.0.0.0/0 o IPs de Vercel)
- [ ] URI de conexión copiada

## 📝 URLs Importantes

- **Dashboard Vercel**: https://vercel.com/dashboard
- **Documentación Vercel**: https://vercel.com/docs
- **Logs del Proyecto**: Dashboard → Tu Proyecto → Deployments → Functions → Logs

---

## 🆘 Si algo falla

1. Revisa los logs en Vercel Dashboard
2. Verifica las variables de entorno
3. Prueba el build localmente: `npm run build`
4. Consulta `VERCEL_DEPLOY.md` para troubleshooting detallado

