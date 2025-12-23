// Re-export ValidationError from entity
export { ValidationError } from './entity/student.entity';

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

export const Exceptions = {
    STUDENT_NOT_CREATED: {
        code: 'EDU-STUDENT-001',
        description: 'Error al crear el estudiante',
    },
    STUDENT_NOT_FOUND: {
        code: 'EDU-STUDENT-002',
        description: 'El estudiante con ID ${0} no fue encontrado',
    },
    STUDENT_NOT_UPDATED: {
        code: 'EDU-STUDENT-003',
        description: 'Error al actualizar el estudiante',
    },
    STUDENT_NOT_REMOVED: {
        code: 'EDU-STUDENT-004',
        description: 'Error al dar de baja al estudiante',
    },
    STUDENT_DUPLICATE_RUT: {
        code: 'EDU-STUDENT-005',
        description: 'Ya existe un estudiante con el RUT ${0}',
    },
    STUDENT_DUPLICATE_EMAIL: {
        code: 'EDU-STUDENT-006',
        description: 'Ya existe un estudiante con el email ${0}',
    },
    STUDENT_ALREADY_INACTIVE: {
        code: 'EDU-STUDENT-007',
        description: 'El estudiante ya está inactivo',
    },
    STUDENT_INVALID_AGE: {
        code: 'EDU-STUDENT-008',
        description: 'La edad del estudiante debe estar entre 4 y 25 años',
    },
    STUDENT_LIST_ERROR: {
        code: 'EDU-STUDENT-009',
        description: 'Error al listar estudiantes',
    },
    CANNOT_UPDATE_REMOVED: {
        code: 'EDU-STUDENT-010',
        description: 'No se puede actualizar un estudiante que ha sido retirado',
    },
};
