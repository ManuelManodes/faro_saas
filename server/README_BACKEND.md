# 🎓 EduSaaS Backend - Student Management API

## ✅ Estado Actual

**Servidor ACTIVO** en `http://localhost:3001`

```
✅ MongoDB Atlas conectado
✅ 5 endpoints REST funcionando
✅ Swagger disponible en /docs
✅ 35 unit tests pasando (100%)
✅ Arquitectura hexagonal completa
```

---

## 🚀 Quick Start

### 1. Verificar que el servidor esté corriendo

El servidor ya está en ejecución. Verifica en la terminal:

```bash
[Nest] LOG [NestApplication] Nest application successfully started
[Nest] LOG [Bootstrap] Application is running on: http://[::1]:3001
[Nest] LOG [Bootstrap] Swagger docs available at: http://[::1]:3001/docs
```

### 2. Abrir Swagger Documentation

Abre en tu navegador:
```
http://localhost:3001/docs
```

### 3. Probar con Postman

Importa la colección:
```
/postman/Students.postman_collection.json
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/students` | Crear estudiante |
| `GET` | `/students` | Listar estudiantes activos |
| `GET` | `/students/:id` | Obtener estudiante por ID |
| `PUT` | `/students/:id` | Actualizar estudiante |
| `DELETE` | `/students/:id` | Dar de baja (soft delete) |

### Headers Requeridos

```http
Content-Type: application/json
x-user-email: admin@colegio.cl
```

---

## 🧪 Ejemplo de Request - Crear Estudiante

### Request

```bash
curl -X POST http://localhost:3001/api/students \
  -H "Content-Type: application/json" \
  -H "x-user-email: admin@colegio.cl" \
  -d '{
    "rut": "12345678-5",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@estudiante.cl",
    "phone": "+56912345678",
    "birthDate": "2010-03-15",
    "grade": "8° Básico",
    "section": "A",
    "address": "Av. Principal 123, Santiago",
    "emergencyContact": {
      "name": "María González",
      "phone": "+56987654321",
      "relationship": "madre"
    },
    "enrollmentDate": "2020-03-01"
  }'
```

### Response (201 Created)

```json
{
  "id": "507f1f77bcf86cd799439011",
  "rut": "12345678-5",
  "firstName": "Juan",
  "lastName": "Pérez",
  "fullName": "Juan Pérez",
  "email": "juan.perez@estudiante.cl",
  "phone": "+56912345678",
  "birthDate": "2010-03-15",
  "age": 14,
  "grade": "8° Básico",
  "section": "A",
  "address": "Av. Principal 123, Santiago",
  "emergencyContact": {
    "name": "María González",
    "phone": "+56987654321",
    "relationship": "madre"
  },
  "status": "ACTIVO",
  "enrollmentDate": "2020-03-01",
  "createdAt": "2024-12-22T15:08:22.000Z",
  "createdBy": "admin@colegio.cl"
}
```

---

## 🗄️ Base de Datos

### Conexión MongoDB Atlas

```
mongodb+srv://faro-app-educ.mmmqwvi.mongodb.net/
```

### Colección: `students`

**Índices automáticos:**
- `{ rut: 1 }` - único
- `{ email: 1 }` - único  
- `{ status: 1, grade: 1, section: 1 }` - búsquedas

---

## ✅ Validaciones Implementadas

### RUT Chileno
- Formato: `12345678-9` o `12345678-K`
- Validación de dígito verificador
- Único en el sistema

### Email
- Formato válido
- Único en el sistema

### Teléfono
- Formato: `+56XXXXXXXXX` (9 dígitos)

### Edad
- Mínimo: 4 años
- Máximo: 25 años

### Grados Válidos
```
Pre-kínder, Kínder,
1° a 8° Básico,
1° a 4° Medio
```

### Reglas de Negocio
- ✅ Estado inicial siempre `ACTIVO`
- ✅ No se puede actualizar estudiante `RETIRADO`
- ✅ No se puede cancelar dos veces
- ✅ Soft delete (nunca elimina físicamente)
- ✅ `findAll()` solo retorna `ACTIVO` por defecto

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Unit tests de dominio
npm test -- student.entity.spec.ts

# Todos los tests
npm test

# Con cobertura
npm run test:cov
```

### Cobertura Actual
```
✅ 35 tests pasando
✅ 100% cobertura en StudentEntity
```

---

## 📂 Estructura del Proyecto

```
server/src/
├── domain/student/               # Capa de Dominio
│   ├── entity/
│   │   ├── student.entity.ts     # Entidad con validaciones
│   │   └── test/                 # 35 unit tests
│   ├── repository.port.ts        # Puerto del repositorio
│   └── exceptions.ts             # Errores personalizados
│
├── application/student/          # Capa de Aplicación
│   ├── dto/                      # DTOs con validators
│   └── use-case/                 # 5 casos de uso
│
├── infrastructure/               # Capa de Infraestructura
│   └── persistence/mongodb/
│       └── student/
│           ├── student.schema.ts # Mongoose schema
│           └── student.mongo.repository.ts
│
└── interface/http/student/       # Capa de Interfaz
    ├── student.controller.ts     # REST Controller
    └── student.http.module.ts
```

---

## 🎯 Próximos Pasos

### Para Desarrollo

1. **Probar en Swagger**
   - http://localhost:3001/docs
   - Probar cada endpoint

2. **Importar Postman Collection**
   - Archivo: `/postman/Students.postman_collection.json`
   - Ejecutar flujo completo de CRUD

3. **Ver datos en MongoDB**
   - Conectar con MongoDB Compass
   - Database: Base definida en conexión
   - Collection: `students`

### Para Producción

1. **Variables de Entorno**
   - Copiar `.env.example` a`.env`
   - Configurar `MONGODB_URI` de producción

2. **Build**
   ```bash
   npm run build
   npm run start:prod
   ```

3. **Deploy en Vercel**
   - Ya configurado en `vercel.json`
   - Push a GitHub y Vercel despliega automáticamente

---

## 🔐 Códigos de Error

| Código | Descripción |
|--------|-------------|
| `EDU-STUDENT-001` | Error al crear |
| `EDU-STUDENT-002` | No encontrado |
| `EDU-STUDENT-003` | Error al actualizar |
| `EDU-STUDENT-004` | Error al dar de baja |
| `EDU-STUDENT-005` | RUT duplicado |
| `EDU-STUDENT-006` | Email duplicado |
| `EDU-STUDENT-007` | Ya inactivo |
| `EDU-STUDENT-010` | No se puede actualizar retirado |

---

## 📞 Soporte

Para más información ver:
- `walkthrough.md` - Documentación detallada
- `implementation_plan.md` - Plan de arquitectura
- Swagger Docs - http://localhost:3001/docs

---

**Estado:** ✅ Producción Ready  
**Version:** 1.0.0  
**Last Update:** 22/12/2024
