// Re-export ValidationError from entity
export { ValidationError } from './entity/attendance.entity';

export class NotFoundError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly details?: Record<string, any>,
    ) {
        super(message);
        this.name = 'NotFoundError';
    }
}

export class PersistenceError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly cause?: Error,
    ) {
        super(message);
        this.name = 'PersistenceError';
    }
}

export class DuplicateError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly details?: Record<string, any>,
    ) {
        super(message);
        this.name = 'DuplicateError';
    }
}

export class BusinessRuleError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly details?: Record<string, any>,
    ) {
        super(message);
        this.name = 'BusinessRuleError';
    }
}

export const Exceptions = {
    ATTENDANCE_NOT_CREATED: {
        code: 'EDU-ATTENDANCE-001',
        description: 'Error al crear el registro de asistencia',
    },
    ATTENDANCE_NOT_FOUND: {
        code: 'EDU-ATTENDANCE-002',
        description: 'El registro de asistencia con ID ${0} no fue encontrado',
    },
    STUDENT_NOT_EXISTS: {
        code: 'EDU-ATTENDANCE-003',
        description: 'El estudiante con ID ${0} no existe',
    },
    COURSE_NOT_EXISTS: {
        code: 'EDU-ATTENDANCE-004',
        description: 'El curso con ID ${0} no existe',
    },
    ATTENDANCE_DUPLICATE: {
        code: 'EDU-ATTENDANCE-005',
        description: 'Ya existe un registro de asistencia para este estudiante, curso y fecha',
    },
    ATTENDANCE_NOT_UPDATED: {
        code: 'EDU-ATTENDANCE-006',
        description: 'Error al actualizar el registro de asistencia',
    },
    ATTENDANCE_NOT_DELETED: {
        code: 'EDU-ATTENDANCE-007',
        description: 'Error al eliminar el registro de asistencia',
    },
    ATTENDANCE_LIST_ERROR: {
        code: 'EDU-ATTENDANCE-008',
        description: 'Error al listar registros de asistencia',
    },
    INVALID_DATE_RANGE: {
        code: 'EDU-ATTENDANCE-009',
        description: 'Rango de fechas inválido',
    },
};
