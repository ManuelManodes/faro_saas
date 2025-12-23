# PROMPT PARA IMPLEMENTACIÓN - GESTIÓN DE RESERVAS DE AGENDAMIENTO

---

## CONTEXTO DEL PROYECTO

Estoy trabajando en una API NestJS con Arquitectura Hexagonal (Puertos y Adaptadores) con Node.js 22.
El proyecto sigue esta estructura de capas con dependencias estrictas:

- **domain/** (entidades, puertos) - capa más interna
- **application/** (casos de uso, DTOs)
- **infrastructure/** (adaptadores: MongoDB, logger, tracing)
- **interface/** (controladores HTTP, filtros, interceptores)

**Regla crítica**: Las capas internas NUNCA importan de capas externas.

---

## HISTORIA DE USUARIO A IMPLEMENTAR

### Descripción
Como desarrollador backend, quiero exponer endpoints para gestionar el ciclo de vida completo 
de reservas de agendamiento (crear, actualizar, cancelar), validando reglas de negocio y 
disponibilidad de slots.

### Endpoints Requeridos

1. **POST** `/sellex/calendar/reservation/v1` - Crear reserva
2. **PUT** `/sellex/calendar/reservation/v1/{id}` - Actualizar reserva
3. **DELETE** `/sellex/calendar/reservation/v1/{id}` - Cancelar reserva (soft delete)

---

## MODELO DE DOMINIO - ReservationEntity

### Campos obligatorios:
- **id**: string (UUID)
- **requestNumber**: string (3-50 chars, alfanumérico con guiones)
- **providerName**: string (3-200 chars)
- **startDateTime**: Date (ISO 8601 con timezone)
- **endDateTime**: Date (ISO 8601 con timezone)
- **state**: enum ('AGENDADO' | 'CANCELADA')
- **contactEmail**: string (formato email válido)
- **contactPhone**: string (formato +56XXXXXXXXX)
- **createdAt**: Date
- **createdBy**: string (email)

### Campos opcionales:
- **notes**: string (max 500 chars)
- **updatedAt**: Date
- **updatedBy**: string (email)
- **cancelledAt**: Date
- **cancelledBy**: string (email)

### Validaciones de negocio en la entidad:

1. **requestNumber**: debe ser alfanumérico con guiones, 3-50 chars
2. **providerName**: 3-200 caracteres
3. **startDateTime** debe ser menor que **endDateTime**
4. La duración (endDateTime - startDateTime) debe ser entre 30 min y 4 horas
5. **contactEmail**: formato válido (regex email estándar)
6. **contactPhone**: formato chileno +56XXXXXXXXX (9 dígitos después del +56)
7. **notes**: máximo 500 caracteres si está presente
8. **state**: solo valores 'AGENDADO' o 'CANCELADA'

---

## CONTRATOS DE REQUEST/RESPONSE

### POST - Crear Reserva

**Request Body:**
```json
{
  "requestNumber": "REQ-12345",
  "providerName": "Proveedor ABC S.A.",
  "startDateTime": "2025-12-10T14:00:00-03:00",
  "endDateTime": "2025-12-10T15:00:00-03:00",
  "contactEmail": "contacto@proveedor.cl",
  "contactPhone": "+56912345678",
  "notes": "Entrega de mercadería"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "requestNumber": "REQ-12345",
  "providerName": "Proveedor ABC S.A.",
  "startDateTime": "2025-12-10T14:00:00-03:00",
  "endDateTime": "2025-12-10T15:00:00-03:00",
  "state": "AGENDADO",
  "contactEmail": "contacto@proveedor.cl",
  "contactPhone": "+56912345678",
  "notes": "Entrega de mercadería",
  "createdAt": "2025-12-01T10:30:00.000Z",
  "createdBy": "user@example.com"
}
```

### PUT - Actualizar Reserva

**Request Body (todos los campos opcionales):**
```json
{
  "providerName": "Proveedor ABC S.A.",
  "startDateTime": "2025-12-11T10:00:00-03:00",
  "endDateTime": "2025-12-11T11:00:00-03:00",
  "contactEmail": "nuevo@proveedor.cl",
  "contactPhone": "+56987654321",
  "notes": "Horario modificado"
}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "requestNumber": "REQ-12345",
  "providerName": "Proveedor ABC S.A.",
  "startDateTime": "2025-12-11T10:00:00-03:00",
  "endDateTime": "2025-12-11T11:00:00-03:00",
  "state": "AGENDADO",
  "contactEmail": "nuevo@proveedor.cl",
  "contactPhone": "+56987654321",
  "notes": "Horario modificado",
  "updatedAt": "2025-12-01T11:00:00.000Z",
  "updatedBy": "user@example.com",
  "createdAt": "2025-12-01T10:30:00.000Z",
  "createdBy": "user@example.com"
}
```

### DELETE - Cancelar Reserva

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "requestNumber": "REQ-12345",
  "state": "CANCELADA",
  "cancelledAt": "2025-12-01T12:00:00.000Z",
  "cancelledBy": "user@example.com"
}
```

---

## REGLAS DE NEGOCIO ADICIONALES

**RN-001**: Las reservas deben crearse con al menos 24 horas de anticipación
- Validar en `CreateReservationUseCase`
- Error: `INSUFFICIENT_ADVANCE_TIME` (400 Bad Request)

**RN-002**: No se puede actualizar una reserva cancelada
- Validar en `UpdateReservationUseCase`
- Error: `CANNOT_UPDATE_CANCELLED` (400 Bad Request)

**RN-003**: No se puede cancelar una reserva ya cancelada
- Validar en `RemoveReservationUseCase`
- Error: `ALREADY_CANCELLED` (400 Bad Request)

---

## CÓDIGOS DE ERROR A AGREGAR EN exception-list.ts

```typescript
RESERVATION_NOT_CREATED: {
  code: 'BX-RESERVATION-001',
  description: 'Error al crear la reserva en la base de datos',
},
RESERVATION_NOT_FOUND: {
  code: 'BX-RESERVATION-002',
  description: 'La reserva con ID ${0} no fue encontrada',
},
RESERVATION_NOT_UPDATED: {
  code: 'BX-RESERVATION-003',
  description: 'Error al actualizar la reserva',
},
RESERVATION_NOT_DELETED: {
  code: 'BX-RESERVATION-004',
  description: 'Error al cancelar la reserva',
},
RESERVATION_LIST_ERROR: {
  code: 'BX-RESERVATION-005',
  description: 'Error al listar reservas',
},
INSUFFICIENT_ADVANCE_TIME: {
  code: 'BX-RESERVATION-006',
  description: 'Debe agendar con al menos 24 horas de anticipación',
},
CANNOT_UPDATE_CANCELLED: {
  code: 'BX-RESERVATION-007',
  description: 'No se puede actualizar una reserva cancelada',
},
ALREADY_CANCELLED: {
  code: 'BX-RESERVATION-008',
  description: 'La reserva ya está cancelada',
},
```

---

## TAREAS DE IMPLEMENTACIÓN

Implementa un servicio CRUD completo de "reservation" siguiendo EXACTAMENTE los patrones 
del proyecto. Genera TODO el código necesario en las 4 capas de arquitectura hexagonal.

---

## FASE 1: CAPA DE DOMINIO

### Tarea 1.1 - Crear entidad ReservationEntity

**Archivo:** `src/domain/reservation/entity/reservation.entity.ts`

**Requisitos:**
- Implementar constructor con TODAS las validaciones listadas arriba
- Usar `ValidationError` para validaciones fallidas
- Incluir método estático auxiliar para validar rango de fechas
- NO usar `any`, tipos explícitos obligatorios
- Validaciones obligatorias:
  - requestNumber: regex `/^[A-Za-z0-9-]{3,50}$/`
  - providerName: longitud 3-200
  - startDateTime < endDateTime
  - Duración entre 30 min (1800000 ms) y 4 horas (14400000 ms)
  - contactEmail: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - contactPhone: regex `/^\+56\d{9}$/`
  - notes: max 500 chars si existe
  - state: solo 'AGENDADO' o 'CANCELADA'

### Tarea 1.2 - Crear puerto de repositorio

**Archivo:** `src/domain/reservation/repository.port.ts`

**Requisitos:**
- Token de inyección:
  ```typescript
  export const RESERVATION_REPOSITORY = Symbol('RESERVATION_REPOSITORY');
  ```
- Interface con métodos:
  ```typescript
  export interface ReservationRepositoryPort {
    save(entity: ReservationEntity): Promise<ReservationEntity>;
    findById(id: string): Promise<ReservationEntity | null>;
    findAll(): Promise<ReservationEntity[]>;
    update(id: string, entity: Partial<ReservationEntity>): Promise<ReservationEntity | null>;
    cancel(id: string, cancelledBy: string, cancelledAt: Date): Promise<ReservationEntity | null>;
  }
  ```

### Tarea 1.3 - Tests de entidad

**Archivo:** `src/domain/reservation/entity/test/reservation.entity.spec.ts`

**Requisitos:**
- Tests de casos válidos (happy path)
- Tests de TODAS las validaciones (mínimo 10 casos negativos):
  - requestNumber inválido (vacío, muy corto, muy largo, caracteres especiales)
  - providerName inválido (vacío, muy corto, muy largo)
  - startDateTime >= endDateTime
  - Duración < 30 min o > 4 horas
  - contactEmail inválido (sin @, sin dominio, formato incorrecto)
  - contactPhone inválido (sin +56, menos/más de 9 dígitos, letras)
  - notes > 500 chars
  - state con valor inválido
- Cobertura objetivo: **100%**
- Todos los tests en español

---

## FASE 2: CAPA DE APLICACIÓN

### Tarea 2.1 - DTOs de entrada

**Archivo:** `src/application/reservation/dto/create-reservation.input.ts`

**Requisitos:**
- Clase (NO interface) con decoradores `@ApiProperty` y `class-validator`
- Validaciones:
  - `@IsString()`, `@MinLength(3)`, `@MaxLength(50)`, `@Matches(/^[A-Za-z0-9-]{3,50}$/)` para requestNumber
  - `@IsString()`, `@MinLength(3)`, `@MaxLength(200)` para providerName
  - `@IsDateString()` para startDateTime y endDateTime
  - `@IsEmail()` para contactEmail
  - `@Matches(/^\+56\d{9}$/)` para contactPhone
  - `@IsOptional()`, `@IsString()`, `@MaxLength(500)` para notes
- Mensajes de validación en español
- Ejemplos en cada `@ApiProperty`

**Archivo:** `src/application/reservation/dto/update-reservation.input.ts`

**Requisitos:**
- Usar `PartialType(CreateReservationInput)` de `@nestjs/swagger`
- Todos los campos opcionales
- NO permitir cambiar requestNumber (excluirlo o documentar que se ignora)

### Tarea 2.2 - DTO de salida con mapeo

**Archivo:** `src/application/reservation/dto/reservation.output.ts`

**Requisitos:**
- Clase `ReservationOutput` con TODOS los campos del modelo
- Decoradores `@ApiProperty` completos con:
  - description en español
  - type
  - example
- Función de mapeo:
  ```typescript
  export function mapEntityToOutput(entity: ReservationEntity): ReservationOutput
  ```
- Clase adicional `CancelledReservationOutput` para respuesta de DELETE:
  - Solo campos: id, requestNumber, state, cancelledAt, cancelledBy
- Función de mapeo:
  ```typescript
  export function mapEntityToCancelledOutput(entity: ReservationEntity): CancelledReservationOutput
  ```

### Tarea 2.3 - Casos de uso

**CRÍTICO**: Importar puerto con patrón correcto:
```typescript
import { RESERVATION_REPOSITORY } from '../../../domain/reservation/repository.port';
import type { ReservationRepositoryPort } from '../../../domain/reservation/repository.port';
```

#### Archivo: `src/application/reservation/use-case/create-reservation.usecase.ts`

**Requisitos:**
- Inyectar: `@Inject(RESERVATION_REPOSITORY) private readonly repository: ReservationRepositoryPort`
- Método: `async execute(input: CreateReservationInput, createdBy: string): Promise<ReservationOutput>`
- Validar RN-001: `startDateTime` debe ser al menos 24h después de `new Date()`
  - Si falla: lanzar `ValidationError` con mensaje de `Exceptions.INSUFFICIENT_ADVANCE_TIME`
- Generar UUID para id: `import { randomUUID } from 'crypto'`
- Crear entidad con estado 'AGENDADO'
- Guardar en repositorio
- Retornar DTO usando `mapEntityToOutput()`

#### Archivo: `src/application/reservation/use-case/list-reservation.usecase.ts`

**Requisitos:**
- Método: `async execute(): Promise<ReservationOutput[]>`
- Obtener todas las reservas del repositorio (solo devolverá estado 'AGENDADO')
- Mapear array a DTOs

#### Archivo: `src/application/reservation/use-case/get-reservation.usecase.ts`

**Requisitos:**
- Método: `async execute(id: string): Promise<ReservationOutput>`
- Buscar por ID en repositorio
- Si no existe, lanzar `NotFoundError` con patrón correcto:
  ```typescript
  throw new NotFoundError(
    Exceptions.RESERVATION_NOT_FOUND.description.replace('${0}', id),
    Exceptions.RESERVATION_NOT_FOUND.code,
    { id }
  );
  ```
- Retornar DTO

#### Archivo: `src/application/reservation/use-case/update-reservation.usecase.ts`

**Requisitos:**
- Método: `async execute(id: string, input: UpdateReservationInput, updatedBy: string): Promise<ReservationOutput>`
- Buscar reserva existente (usar GetReservationUseCase o llamar directamente al repositorio)
- Validar RN-002: Si `state === 'CANCELADA'`, lanzar `ValidationError` con mensaje de `Exceptions.CANNOT_UPDATE_CANCELLED`
- Si hay cambio de startDateTime/endDateTime, validar RN-001 (24h anticipación)
- Crear objeto con campos a actualizar + `updatedAt: new Date()` + `updatedBy`
- Llamar `repository.update(id, updatedFields)`
- Si retorna null, lanzar `NotFoundError`
- Retornar DTO

#### Archivo: `src/application/reservation/use-case/remove-reservation.usecase.ts`

**Requisitos:**
- Método: `async execute(id: string, cancelledBy: string): Promise<CancelledReservationOutput>`
- Buscar reserva existente
- Validar RN-003: Si `state === 'CANCELADA'`, lanzar `ValidationError` con mensaje de `Exceptions.ALREADY_CANCELLED`
- Llamar `repository.cancel(id, cancelledBy, new Date())`
- Si retorna null, lanzar `NotFoundError`
- Retornar DTO usando `mapEntityToCancelledOutput()`

### Tarea 2.4 - Tests de casos de uso

**Archivo:** `src/application/reservation/use-case/reservation.usecases.spec.ts`

**Requisitos:**
- Crear repositorio fake en memoria (Map<string, ReservationEntity>)
- Implementar TODOS los métodos del puerto en el fake
- Suite de tests para CADA caso de uso:
  - **CreateReservationUseCase:**
    - Happy path: crea y retorna reserva
    - Error: viola RN-001 (menos de 24h)
    - Error: datos inválidos en entidad
  - **ListReservationUseCase:**
    - Happy path: retorna lista vacía
    - Happy path: retorna múltiples reservas
  - **GetReservationUseCase:**
    - Happy path: encuentra reserva
    - Error: reserva no existe (NotFoundError)
  - **UpdateReservationUseCase:**
    - Happy path: actualiza campos
    - Error: reserva no existe
    - Error: intenta actualizar cancelada (RN-002)
    - Error: nuevo slot viola RN-001
  - **RemoveReservationUseCase:**
    - Happy path: cancela reserva
    - Error: reserva no existe
    - Error: ya está cancelada (RN-003)
- Cobertura objetivo: **100%**
- Tests en español

### Tarea 2.5 - Tests de mapeo

**Archivo:** `src/application/reservation/dto/reservation.output.spec.ts`

**Requisitos:**
- Test de `mapEntityToOutput()`: verificar todos los campos
- Test de `mapEntityToCancelledOutput()`: verificar campos específicos
- Incluir casos con campos opcionales (notes, updatedAt, etc.)

---

## FASE 3: CAPA DE INFRAESTRUCTURA

### Tarea 3.1 - Agregar códigos de error

**Archivo:** `src/interface/http/exception/exception-list.ts`

**Requisitos:**
- Agregar TODOS los códigos listados arriba (BX-RESERVATION-001 a 008)
- Seguir el formato existente en el archivo

### Tarea 3.2 - Implementar repositorio MongoDB

**Archivo:** `src/infrastructure/persistence/mongodb/reservation/reservation.mongo.repository.ts`

**Requisitos:**
- Decorador `@Injectable()`
- Implementar `implements ReservationRepositoryPort`
- Inyectar: `@Inject(MONGODB_DB) private readonly db: Db`
- Constructor: `this.collection = this.db.collection('reservations')`
- **CRÍTICO**: Mapear `_id: ObjectId` ↔ `id: string` en TODOS los métodos
- **CRÍTICO**: Envolver TODAS las operaciones en try-catch
- Lanzar `PersistenceError` con patrón correcto:
  ```typescript
  throw new PersistenceError(
    Exceptions.RESERVATION_NOT_CREATED.description,
    Exceptions.RESERVATION_NOT_CREATED.code, // ← Solo .code (string)
    error, // ← Error original
  );
  ```

**Método `save(entity)`:**
- Convertir entity a documento (sin id, sin _id)
- `collection.insertOne(doc)`
- Mapear `insertedId` a string y crear entidad
- En catch: lanzar `PersistenceError` con `RESERVATION_NOT_CREATED`

**Método `findById(id)`:**
- Convertir id string a ObjectId
- `collection.findOne({ _id: new ObjectId(id) })`
- Si no existe: retornar null
- Si existe: mapear documento a entidad
- En catch: lanzar `PersistenceError` con `RESERVATION_NOT_FOUND`

**Método `findAll()`:**
- `collection.find({ state: 'AGENDADO' }).toArray()` - **EXCLUIR canceladas**
- Mapear documentos a entidades
- En catch: lanzar `PersistenceError` con `RESERVATION_LIST_ERROR`

**Método `update(id, partialEntity)`:**
- Convertir id a ObjectId
- Crear objeto $set con campos de partialEntity (excluir id)
- `collection.findOneAndUpdate({ _id }, { $set }, { returnDocument: 'after' })`
- Verificar `matchedCount`, si 0: retornar null
- Mapear documento actualizado a entidad
- En catch: lanzar `PersistenceError` con `RESERVATION_NOT_UPDATED`

**Método `cancel(id, cancelledBy, cancelledAt)`:**
- Convertir id a ObjectId
- `collection.findOneAndUpdate({ _id }, { $set: { state: 'CANCELADA', cancelledBy, cancelledAt } }, { returnDocument: 'after' })`
- Si no existe: retornar null
- Mapear documento a entidad
- En catch: lanzar `PersistenceError` con `RESERVATION_NOT_DELETED`

### Tarea 3.3 - Módulo de persistencia

**Archivo:** `src/infrastructure/persistence/mongodb/reservation/reservation.mongo.module.ts`

**Requisitos:**
```typescript
import { Module } from '@nestjs/common';
import { MongodbModule } from '../mongodb.module';
import { RESERVATION_REPOSITORY } from '../../../../domain/reservation/repository.port';
import { ReservationMongoRepository } from './reservation.mongo.repository';

@Module({
  imports: [MongodbModule],
  providers: [
    {
      provide: RESERVATION_REPOSITORY,
      useClass: ReservationMongoRepository,
    },
  ],
  exports: [RESERVATION_REPOSITORY],
})
export class ReservationMongoModule {}
```

### Tarea 3.4 - Tests de repositorio

**Archivo:** `src/infrastructure/persistence/mongodb/reservation/test/reservation.mongo.repository.spec.ts`

**Requisitos:**
- Crear repositorio fake en memoria (igual al de casos de uso)
- Tests de contrato para TODOS los métodos:
  - save(): guarda y retorna con id
  - findById(): encuentra existente, retorna null si no existe
  - findAll(): retorna solo AGENDADAS (no CANCELADAS)
  - update(): actualiza campos, retorna null si no existe
  - cancel(): cambia state, agrega campos de auditoría
- Validar mapeo _id ↔ id
- Opcionalmente: 5 tests adicionales con `mongodb-memory-server`
- Cobertura objetivo: **>95%**
- Tests en español

---

## FASE 4: CAPA DE INTERFAZ HTTP

### Tarea 4.1 - Crear controlador

**Archivo:** `src/interface/http/reservation/reservation.controller.ts`

**Requisitos:**
- Decoradores del controlador:
  ```typescript
  @ApiTags('Reservations')
  @Controller({ version: '1', path: 'sellex/calendar/reservation' })
  ```
- Inyectar los 5 casos de uso en constructor

**Endpoints:**

#### 1. POST / - Crear reserva
```typescript
@Post()
@ApiOperation({ summary: 'Crear reserva de agendamiento' })
@ApiCreatedResponse({ description: 'Reserva creada exitosamente', type: ReservationOutput })
@ApiBadRequestResponse({ description: 'Datos inválidos o violación de reglas de negocio' })
async create(
  @Body() input: CreateReservationInput,
  @Headers('x-user-email') userEmail: string,
): Promise<ReservationOutput>
```

#### 2. GET / - Listar reservas
```typescript
@Get()
@ApiOperation({ summary: 'Listar reservas agendadas' })
@ApiOkResponse({ description: 'Lista de reservas', type: [ReservationOutput] })
async findAll(): Promise<ReservationOutput[]>
```

#### 3. GET /:id - Obtener reserva
```typescript
@Get(':id')
@ApiOperation({ summary: 'Obtener reserva por ID' })
@ApiOkResponse({ description: 'Reserva encontrada', type: ReservationOutput })
@ApiNotFoundResponse({ description: 'Reserva no encontrada' })
@ApiParam({ name: 'id', description: 'UUID de la reserva', type: String })
async findOne(@Param('id') id: string): Promise<ReservationOutput>
```

#### 4. PUT /:id - Actualizar reserva
```typescript
@Put(':id')
@ApiOperation({ summary: 'Actualizar reserva' })
@ApiOkResponse({ description: 'Reserva actualizada', type: ReservationOutput })
@ApiNotFoundResponse({ description: 'Reserva no encontrada' })
@ApiBadRequestResponse({ description: 'No se puede actualizar reserva cancelada' })
@ApiParam({ name: 'id', description: 'UUID de la reserva', type: String })
async update(
  @Param('id') id: string,
  @Body() input: UpdateReservationInput,
  @Headers('x-user-email') userEmail: string,
): Promise<ReservationOutput>
```

#### 5. DELETE /:id - Cancelar reserva
```typescript
@Delete(':id')
@ApiOperation({ summary: 'Cancelar reserva (soft delete)' })
@ApiOkResponse({ description: 'Reserva cancelada', type: CancelledReservationOutput })
@ApiNotFoundResponse({ description: 'Reserva no encontrada' })
@ApiBadRequestResponse({ description: 'La reserva ya está cancelada' })
@ApiParam({ name: 'id', description: 'UUID de la reserva', type: String })
async remove(
  @Param('id') id: string,
  @Headers('x-user-email') userEmail: string,
): Promise<CancelledReservationOutput>
```

### Tarea 4.2 - Módulo HTTP

**Archivo:** `src/interface/http/reservation/reservation.http.module.ts`

**Requisitos:**
```typescript
import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationMongoModule } from '../../../infrastructure/persistence/mongodb/reservation/reservation.mongo.module';
import { CreateReservationUseCase } from '../../../application/reservation/use-case/create-reservation.usecase';
import { ListReservationUseCase } from '../../../application/reservation/use-case/list-reservation.usecase';
import { GetReservationUseCase } from '../../../application/reservation/use-case/get-reservation.usecase';
import { UpdateReservationUseCase } from '../../../application/reservation/use-case/update-reservation.usecase';
import { RemoveReservationUseCase } from '../../../application/reservation/use-case/remove-reservation.usecase';

@Module({
  imports: [ReservationMongoModule],
  controllers: [ReservationController],
  providers: [
    CreateReservationUseCase,
    ListReservationUseCase,
    GetReservationUseCase,
    UpdateReservationUseCase,
    RemoveReservationUseCase,
  ],
})
export class ReservationHttpModule {}
```

### Tarea 4.3 - Tests de controlador

**Archivo:** `src/interface/http/reservation/test/reservation.controller.spec.ts`

**Requisitos:**
- Mockear TODOS los casos de uso con `jest.fn()`
- Tests de happy paths para los 5 endpoints:
  - POST /: crea y retorna 201
  - GET /: retorna array de reservas
  - GET /:id: retorna reserva específica
  - PUT /:id: actualiza y retorna 200
  - DELETE /:id: cancela y retorna 200
- Verificar que se llaman los casos de uso con parámetros correctos
- Cobertura objetivo: **100%**
- Tests en español

**Archivo:** `src/interface/http/reservation/test/reservation.controller.extra.spec.ts`

**Requisitos:**
- Tests de casos de error:
  - Validación de DTOs falla (400)
  - Reserva no encontrada (404) - mockear NotFoundError
  - Violación RN-001: menos de 24h (400) - mockear ValidationError
  - Violación RN-002: actualizar cancelada (400)
  - Violación RN-003: ya cancelada (400)
  - Error de persistencia (500) - mockear PersistenceError
- Tests en español

---

## FASE 5: INTEGRACIÓN Y TESTS E2E

### Tarea 5.1 - Registrar módulo en app.module.ts

**Archivo:** `src/app.module.ts`

**Requisitos:**
- Importar `ReservationHttpModule` en el array de imports
- Agregar al final de la lista de módulos HTTP

### Tarea 5.2 - Tests E2E

**Archivo:** `test/app.e2e-spec.ts`

**Requisitos:**
- Agregar suite completa: `describe('Reservation API (e2e)')`
- Tests de flujo completo:
  1. POST: crear reserva válida → verificar 201 + campos
  2. GET /:id: obtener la reserva creada → verificar 200
  3. GET /: listar reservas → verificar array con al menos 1
  4. PUT /:id: actualizar reserva → verificar 200 + campos actualizados
  5. DELETE /:id: cancelar reserva → verificar 200 + state CANCELADA
  6. GET /: listar reservas → verificar que la cancelada NO aparece
  7. GET /:id de cancelada: debe seguir existiendo
  8. POST con menos de 24h → verificar 400
  9. PUT de cancelada → verificar 400
  10. DELETE de cancelada → verificar 400
  11. GET /:id inexistente → verificar 404
  12. POST con datos inválidos → verificar 400
- Usar conexión MongoDB real o mongodb-memory-server según configuración del proyecto
- Tests en español

### Tarea 5.3 - Verificar cobertura

**Comando:**
```bash
npm run test:cov
```

**Meta:**
- **>95% statements**
- **>85% branches**
- **100% functions**
- **100% lines**

Si no se alcanza, identificar código sin cubrir y agregar tests.

### Tarea 5.4 - Actualizar documentación Swagger

**Pasos:**
1. Ejecutar: `npm run start:dev`
2. Abrir: `http://localhost:3000/docs`
3. Verificar:
   - Los 5 endpoints aparecen bajo tag **"Reservations"**
   - Contratos request/response son correctos
   - Códigos de respuesta están documentados (201, 200, 400, 404, 500)
   - Ejemplos completos en DTOs
   - Parámetros de path documentados
4. Probar cada endpoint desde Swagger UI
5. Exportar spec a `spec/oas.yaml` si es necesario

---

## CHECKLIST DE VALIDACIÓN FINAL

Antes de considerar completa la implementación, verificar:

- [ ] ✅ 4 capas completas (domain, application, infrastructure, interface)
- [ ] ✅ 5 casos de uso implementados (Create, List, Get, Update, Remove/Cancel)
- [ ] ✅ DTOs con decoradores completos (@ApiProperty + class-validator)
- [ ] ✅ Todas las validaciones de negocio en entidad (8 validaciones)
- [ ] ✅ RN-001, RN-002, RN-003 validadas en casos de uso
- [ ] ✅ Soft delete implementado (estado CANCELADA, método cancel en repo)
- [ ] ✅ Auditoría completa (createdBy, updatedBy, cancelledBy con timestamps)
- [ ] ✅ 8 códigos de error agregados en exception-list.ts
- [ ] ✅ Tests unitarios en TODAS las capas (>95% coverage)
- [ ] ✅ Tests E2E con flujo completo (12 escenarios mínimo)
- [ ] ✅ Documentación Swagger completa y funcional
- [ ] ✅ No se usa `any` en ningún lugar
- [ ] ✅ Imports correctos (puerto separado con `import type`)
- [ ] ✅ Manejo de errores correcto:
  - NotFoundError con 3 parámetros (message, code, details)
  - PersistenceError con 3 parámetros (message, code, cause)
  - ValidationError con message apropiado
- [ ] ✅ Mapeo _id ↔ id en repositorio MongoDB en TODOS los métodos
- [ ] ✅ findAll excluye reservas canceladas (filtro por state)
- [ ] ✅ Todos los tests en español con descripciones claras
- [ ] ✅ Módulo HTTP registrado en app.module.ts
- [ ] ✅ Path del controlador correcto: `/sellex/calendar/reservation`
- [ ] ✅ Versión de API configurada: `v1`

---

## ORDEN DE EJECUCIÓN

**Ejecuta las fases EN ORDEN SECUENCIAL**, completando todos los archivos de cada fase 
antes de pasar a la siguiente:

1. **FASE 1 (Dominio)** → Ejecutar tests unitarios: `npm test -- reservation.entity`
2. **FASE 2 (Aplicación)** → Ejecutar tests unitarios: `npm test -- reservation.usecases`
3. **FASE 3 (Infraestructura)** → Ejecutar tests unitarios: `npm test -- reservation.mongo`
4. **FASE 4 (Interfaz)** → Ejecutar tests unitarios: `npm test -- reservation.controller`
5. **FASE 5 (Integración)** → Ejecutar tests E2E: `npm run test:e2e`
6. **Verificar cobertura total**: `npm run test:cov`

---

## ESTRUCTURA FINAL DE ARCHIVOS

Al completar, deberás tener esta estructura:

```
src/
├── domain/reservation/
│   ├── entity/
│   │   ├── reservation.entity.ts
│   │   └── test/
│   │       └── reservation.entity.spec.ts
│   └── repository.port.ts
│
├── application/reservation/
│   ├── dto/
│   │   ├── create-reservation.input.ts
│   │   ├── update-reservation.input.ts
│   │   ├── reservation.output.ts
│   │   └── reservation.output.spec.ts
│   └── use-case/
│       ├── create-reservation.usecase.ts
│       ├── list-reservation.usecase.ts
│       ├── get-reservation.usecase.ts
│       ├── update-reservation.usecase.ts
│       ├── remove-reservation.usecase.ts
│       └── reservation.usecases.spec.ts
│
├── infrastructure/persistence/mongodb/reservation/
│   ├── reservation.mongo.repository.ts
│   ├── reservation.mongo.module.ts
│   └── test/
│       └── reservation.mongo.repository.spec.ts
│
└── interface/http/reservation/
    ├── reservation.controller.ts
    ├── reservation.http.module.ts
    └── test/
        ├── reservation.controller.spec.ts
        └── reservation.controller.extra.spec.ts

test/
└── app.e2e-spec.ts (modificado con suite de Reservation)
```

**Total de archivos:** ~18 archivos nuevos

---

## IMPORTANTE - PATRONES CRÍTICOS A SEGUIR

### 1. Import de Puertos (Error TS1272)
```typescript
// ✅ CORRECTO
import { RESERVATION_REPOSITORY } from '../../../domain/reservation/repository.port';
import type { ReservationRepositoryPort } from '../../../domain/reservation/repository.port';

// ❌ INCORRECTO
import { RESERVATION_REPOSITORY, ReservationRepositoryPort } from '...';
```

### 2. NotFoundError - Requiere 3 argumentos
```typescript
// ✅ CORRECTO
throw new NotFoundError(
  Exceptions.RESERVATION_NOT_FOUND.description.replace('${0}', id),
  Exceptions.RESERVATION_NOT_FOUND.code,
  { id }
);

// ❌ INCORRECTO
throw new NotFoundError(`Reserva ${id} no encontrada`);
```

### 3. PersistenceError - Segundo parámetro es string
```typescript
// ✅ CORRECTO
throw new PersistenceError(
  Exceptions.RESERVATION_NOT_CREATED.description,
  Exceptions.RESERVATION_NOT_CREATED.code, // ← .code es string
  error,
);

// ❌ INCORRECTO
throw new PersistenceError(
  'Error message',
  Exceptions.RESERVATION_NOT_CREATED, // ← Objeto completo
);
```

### 4. DTOs son Clases, NO Interfaces
```typescript
// ✅ CORRECTO
export class CreateReservationInput {
  @ApiProperty({ ... })
  @IsString()
  requestNumber: string;
}

// ❌ INCORRECTO
export interface CreateReservationInput {
  requestNumber: string;
}
```

### 5. PartialType debe ser de @nestjs/swagger
```typescript
// ✅ CORRECTO
import { PartialType } from '@nestjs/swagger';

// ❌ INCORRECTO
import { PartialType } from '@nestjs/mapped-types';
```

### 6. Validación de Fechas - Rangos Realistas
```typescript
// ✅ CORRECTO - Usar milisegundos para duración
const durationMs = endDateTime.getTime() - startDateTime.getTime();
const minDuration = 30 * 60 * 1000; // 30 minutos
const maxDuration = 4 * 60 * 60 * 1000; // 4 horas

// ✅ CORRECTO - Validar 24h anticipación
const now = new Date();
const advanceMs = startDateTime.getTime() - now.getTime();
const requiredAdvanceMs = 24 * 60 * 60 * 1000; // 24 horas

if (advanceMs < requiredAdvanceMs) {
  throw new ValidationError('Debe agendar con al menos 24 horas de anticipación');
}
```

### 7. Mapeo ObjectId en MongoDB
```typescript
// ✅ CORRECTO - En save()
const result = await this.collection.insertOne(doc);
return new ReservationEntity(
  result.insertedId.toString(), // ObjectId → string
  entity.requestNumber,
  // ... otros campos
);

// ✅ CORRECTO - En findById()
const doc = await this.collection.findOne({ _id: new ObjectId(id) });
if (!doc) return null;

return new ReservationEntity(
  doc._id.toString(), // ObjectId → string
  doc.requestNumber,
  // ... otros campos
);
```

---

## NOTAS ADICIONALES

- **Todos los tests deben estar en español** con descripciones claras
- **Mensajes de validación en español** en DTOs
- **Usar `randomUUID()` de 'crypto'** para generar IDs
- **Estado inicial siempre 'AGENDADO'** al crear
- **Soft delete:** nunca eliminar físicamente, solo cambiar state a 'CANCELADA'
- **findAll() solo retorna AGENDADAS:** las canceladas no aparecen en listados
- **Headers obligatorios en controlador:** `x-user-email` para auditoría
- **Cobertura es OBLIGATORIA:** no considerar completo sin >95%

---

## COMANDO PARA EJECUTAR TESTS POR FASE

```bash
# Fase 1 - Tests de dominio
npm test -- reservation.entity.spec.ts

# Fase 2 - Tests de aplicación
npm test -- reservation.usecases.spec.ts
npm test -- reservation.output.spec.ts

# Fase 3 - Tests de infraestructura
npm test -- reservation.mongo.repository.spec.ts

# Fase 4 - Tests de interfaz
npm test -- reservation.controller.spec.ts
npm test -- reservation.controller.extra.spec.ts

# Fase 5 - Tests E2E
npm run test:e2e

# Verificar cobertura total
npm run test:cov
```

---

## DESARROLLO LOCAL - CONFIGURACIÓN

### Variables de entorno (.env)
```env
PORT=3000
NODE_ENV=development
BX_APP_ID=calendar-management-api
BX_LOG_LEVEL=debug

# MongoDB local
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=calendar_dev
MONGO_APP_NAME=calendar-management
```

### MongoDB con Docker
```yaml
# docker-compose.yml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: calendar_dev
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

```bash
docker-compose up -d
npm run start:dev
# Abrir: http://localhost:3000/docs
```

---

## FIN DEL PROMPT

Sigue este plan paso a paso, verificando cada checkpoint antes de continuar.
