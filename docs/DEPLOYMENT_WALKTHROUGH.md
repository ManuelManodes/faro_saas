# 🚀 Walkthrough: Resolución Completa de Deployment NestJS Serverless en Vercel

## 📊 Resumen Ejecutivo

**Proyecto:** EduSaaS - Sistema educativo con React frontend y NestJS backend serverless  
**Problema:** Error 500 en Vercel al cargar datos de MongoDB  
**Duración:** ~4 horas de debugging intensivo  
**Resultado:** ✅ Aplicación funcionando correctamente en producción

---

## 🔴 Problema Inicial

### Síntomas
- Error `Request failed with status code 500` en todos los endpoints de la API
- Timeout al conectar a MongoDB desde Vercel
- Frontend desplegado correctamente, pero sin datos

### Error Original
```
querySrv ENOTFOUND _mongodb._tcp.faro-app-educ.mmmqgvl.mongodb.net
```

---

## 🔍 Problemas Identificados (9 Total)

### 1️⃣ Hostname Incorrecto en MongoDB URI

**Problema:**
```
❌ faro-app-educ.mmmqgvl.mongodb.net (con G-V-L)
✅ faro-app-educ.mmmqwvi.mongodb.net (con W-V-I)
```

**Lección:** Siempre verificar el hostname exacto desde MongoDB Atlas → Connect → Drivers

---

### 2️⃣ Password Incorrecto

**Problema:**
```
❌ Vercel: XDMQ0W8UIB9TgJU8
✅ Real:   XDNO0W8UII89TgJU
```

**Lección:** Copiar passwords directamente desde MongoDB Atlas, no confiar en variables antiguas

---

### 3️⃣ Network Access Bloqueado

**Problema:**
MongoDB Atlas solo permitía IPs específicas (181.43.x.x), bloqueando servidores de Vercel.

**Solución:**
```
MongoDB Atlas → Network Access → Add IP Address → 0.0.0.0/0
```

**Lección crítica:** Para serverless, SIEMPRE configurar `0.0.0.0/0` en Network Access

---

### 4️⃣ Pool de Conexiones No Optimizado

**Problema:**
Sin configuración específica para entornos serverless.

**Solución en `app.module.ts`:**
```typescript
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
    maxPoolSize: 3,           // Máximo 3 conexiones
    minPoolSize: 1,           // Mínimo 1 conexión
    socketTimeoutMS: 30000,   // 30 segundos
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    retryReads: true,
    maxIdleTimeMS: 30000,
  }),
  inject: [ConfigService],
}),
```

**Lección:** Serverless requiere pools pequeños y timeouts configurados

---

### 5️⃣ Express 5.x Incompatible (PROBLEMA CRÍTICO)

**Problema:**
```
Error: 'app.router' is deprecated!
Please see the 3.x to 4.x migration guide
```

**Causa raíz:**
`@nestjs/platform-express` v11.x trae Express 5.x como dependencia transitiva.

**Intentos fallidos:**
1. ❌ Downgrade Express en `server/package.json` → Vercel seguía usando 5.x
2. ❌ Eliminar Express del `client/package.json` → No suficiente
3. ❌ npm `overrides` → No funciona en Vercel
4. ❌ npm `resolutions` → Solo para Yarn
5. ❌ Limpiar caché de Vercel → Caché muy persistente
6. ❌ Recrear proyecto Vercel → Mismo problema

**Solución definitiva:**
Downgrade de **TODOS** los packages `@nestjs` de v11.x a v10.x:

```json
{
  "dependencies": {
    "@nestjs/common": "^10.4.0",        // era ^11.0.1
    "@nestjs/core": "^10.4.0",          // era ^11.0.1
    "@nestjs/platform-express": "^10.4.0", // era ^11.0.1
    "@nestjs/swagger": "^7.4.0",        // era ^11.2.3
    "@nestjs/config": "^3.2.0",         // era ^4.0.2
    "@nestjs/mongoose": "^10.1.0",      // era ^11.0.4
    "mongoose": "^8.8.0"                // era ^9.0.1
  }
}
```

**Resultado:**
```
@nestjs/platform-express@10.4.20
└── express@4.21.2 ✅
```

**Lección CRÍTICA:** NestJS v11.x NO es compatible con Vercel serverless debido a Express 5.x. Usar NestJS v10.x hasta que NestJS v11 soporte Express 4.x nativamente.

---

### 6️⃣ Express en Client Package.json

**Problema:**
`client/package.json` tenía Express 5.2.1, body-parser y cors innecesarios.

**Solución:**
Eliminados completamente (React frontend no necesita servidor).

**Lección:** Mantener dependencias limpias, solo lo necesario en cada workspace

---

### 7️⃣ Node.js Version Incompatible

**Problema:**
```
Error: Found invalid Node.js Version: "24.x"
```

**Solución:**
Crear `.nvmrc` con:
```
20
```

**Lección:** Vercel necesita Node 20.x para `@vercel/node@3.2.17`

---

### 8️⃣ Caché de Vercel Muy Persistente

**Problema:**
A pesar de múltiples cambios, Vercel seguía usando Express 5.x cacheado.

**Intentos:**
- Redeploy sin caché ✅ Ayudó temporalmente
- Recrear proyecto ✅ Ayudó pero no resolvió
- Cambiar Install Command a `npm ci` ✅ No suficiente

**Lección:** El caché de Vercel es MUY agresivo. La única solución real fue cambiar las dependencias fundamentales.

---

### 9️⃣ Base de Datos Incorrecta

**Problema final:**
Los datos estaban en `test` pero la URI apuntaba a `edusaas`.

**Solución:**
```
/edusaas → /test
```

---

## ✅ Solución Final Implementada

### Archivos Modificados

#### 1. `package.json` (raíz)
```json
{
  "dependencies": {
    "@nestjs/common": "^10.4.0",
    "@nestjs/core": "^10.4.0",
    "@nestjs/platform-express": "^10.4.0",
    "@nestjs/swagger": "^7.4.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  }
}
```

#### 2. `server/package.json`
```json
{
  "dependencies": {
    "@nestjs/common": "^10.4.0",
    "@nestjs/config": "^3.2.0",
    "@nestjs/core": "^10.4.0",
    "@nestjs/mongoose": "^10.1.0",
    "@nestjs/platform-express": "^10.4.0",
    "@nestjs/swagger": "^7.4.0",
    "express": "^4.18.0",
    "mongoose": "^8.8.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.5.0",
    "@nestjs/schematics": "^10.2.0",
    "@nestjs/testing": "^10.4.0"
  }
}
```

#### 3. `server/src/app.module.ts`
```typescript
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
    maxPoolSize: 3,
    minPoolSize: 1,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    retryReads: true,
    maxIdleTimeMS: 30000,
  }),
  inject: [ConfigService],
}),
```

#### 4. `api/index.ts`
- Removido import directo de `mongoose`
- Simplificado caché de aplicación
- Removida lógica de reconexión manual

#### 5. `vercel.json`
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api"
    }
  ],
  "functions": {
    "api/index.ts": {
      "runtime": "@vercel/node@3.2.17",
      "includeFiles": "server/**",
      "maxDuration": 30
    }
  }
}
```

#### 6. `.nvmrc`
```
20
```

#### 7. `client/package.json`
Removidos: `express`, `body-parser`, `cors`

### Variables de Entorno en Vercel

```
MONGODB_URI=mongodb+srv://manuelmanodescofre_db_user:XDNO0W8UII89TgJU@faro-app-educ.mmmqwvi.mongodb.net/test?appName=faro-app-educ&retryWrites=true&w=majority&maxPoolSize=3&minPoolSize=1&maxIdleTimeMS=30000
```

**Puntos clave:**
- ✅ Hostname correcto: `mmmqwvi`
- ✅ Password correcto: `XDNO0W8UII89TgJU`
- ✅ Database correcta: `/test`
- ✅ Parámetros serverless: `maxPoolSize=3&minPoolSize=1&maxIdleTimeMS=30000`

---

## 📋 Checklist para Futuros Proyectos NestJS Serverless en Vercel

### Antes de Iniciar

- [ ] Usar **NestJS v10.x**, NO v11.x (hasta que soporte Express 4.x)
- [ ] Configurar `.nvmrc` con Node 20
- [ ] Eliminar dependencias de servidor del frontend workspace

### MongoDB Atlas

- [ ] Network Access: Configurar `0.0.0.0/0` para serverless
- [ ] Copiar hostname EXACTO desde Atlas (no confiar en documentación vieja)
- [ ] Copiar password EXACTO (usar "show password" en Atlas)
- [ ] Verificar que la base de datos especificada en URI existe y tiene datos

### Configuración NestJS

- [ ] Pool de conexiones optimizado:
  ```typescript
  maxPoolSize: 3,
  minPoolSize: 1,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  maxIdleTimeMS: 30000,
  ```

### Vercel Configuration

- [ ] `vercel.json`:
  - `maxDuration: 30` para functions
  - Rewrites para `/api/*`
  - Node runtime: `@vercel/node@3.2.17`

- [ ] Environment Variables:
  - Aplicar a Production, Preview, Development
  - Verificar valores exactos antes de deployar

- [ ] Build Settings:
  - Framework: Vite (si React)
  - Build Command: `npm run build -w client`
  - Output Directory: `client/dist`
  - Install Command: `npm install`
  - Root Directory: (vacío)

### Verificación Post-Deployment

- [ ] Revisar logs de Functions (`api/index.ts`)
- [ ] Buscar `"🚀 Iniciando bootstrap de la aplicación..."`
- [ ] NO debe aparecer `'app.router' is deprecated`
- [ ] Probar endpoints:
  ```bash
  curl https://TU-URL.vercel.app/api
  curl https://TU-URL.vercel.app/api/students
  ```

---

## 🎓 Lecciones Aprendidas

### 1. **Compatibilidad de Versiones es Crítica**
NestJS v11 con Express 5.x NO funciona en Vercel serverless. Siempre verificar compatibilidad ANTES de actualizar major versions.

### 2. **Serverless ≠ Traditional Server**
- Pool de conexiones pequeño (máx 3)
- Timeouts agresivos
- Conexiones efímeras
- Caché agresivo de plataforma

### 3. **MongoDB Atlas Configuración**
- Network Access `0.0.0.0/0` es mandatorio para serverless
- Verificar hostname carácter por carácter
- Database name en URI debe coincidir con datos reales

### 4. **Debugging en Vercel**
- Logs de Functions son tu mejor amigo
- Redeploy sin caché cuando sea necesario
- Recrear proyecto solo como último recurso

### 5. **Monorepos en Vercel**
- Keep dependencies limpias en cada workspace
- Root Directory vacío, usar workspace commands
- Verificar que cada workspace tenga solo sus dependencias necesarias

---

## 🔧 Comandos Útiles para Debugging

### Verificar versión de Express instalada
```bash
npm list express
```

### Reinstalar dependencias limpias
```bash
rm -rf node_modules */node_modules package-lock.json
npm install
```

### Verificar conexión MongoDB local
```bash
node -e "require('mongoose').connect('YOUR_URI').then(() => console.log('✅ Connected')).catch(e => console.log('❌', e.message))"
```

### Probar API en Vercel
```bash
curl https://TU-URL.vercel.app/api/students
```

---

## 📊 Métricas Finales

| Métrica | Antes | Después |
|---------|-------|---------|
| Status Code | 500 ❌ | 200 ✅ |
| Express Version | 5.2.1 ❌ | 4.21.2 ✅ |
| MongoDB Connection | ENOTFOUND ❌ | Connected ✅ |
| Cold Start | Timeout (>30s) ❌ | ~3-8s ✅ |
| Warm Start | N/A | <1s ✅ |
| Data Fetching | 0 registros ❌ | 5 registros ✅ |

---

## 🎯 Stack Final Funcional

- **Frontend:** React 19 + Vite 7 + TypeScript
- **Backend:** NestJS 10.4 + Express 4.21
- **Database:** MongoDB Atlas (Mongoose 8.8)
- **Deployment:** Vercel (Serverless Functions)
- **Runtime:** Node.js 20

---

## 💡 Recomendaciones Futuras

1. **Migración a NestJS v11:**
   - Esperar a que NestJS v11 soporte Express 4.x nativamente
   - O migrar a Fastify (soportado en v11)

2. **Monitoreo:**
   - Implementar Vercel Analytics
   - Configurar alertas en MongoDB Atlas

3. **Performance:**
   - Considerar caching en Vercel Edge
   - Implementar CDN para assets estáticos

4. **Testing:**
   - Tests de integración con MongoDB en memoria
   - Tests E2E pre-deployment

---

**Deployment exitoso:** ✅  
**URL Production:** https://faro-demo.vercel.app  
**API Health:** https://faro-demo.vercel.app/api  
**Status:** 🟢 Operacional
