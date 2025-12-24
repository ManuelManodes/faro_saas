// Re-export ValidationError from entity
export { ValidationError } from './entity/course.entity';

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
    COURSE_NOT_CREATED: {
        code: 'EDU-COURSE-001',
        description: 'Error al crear el curso',
    },
    COURSE_NOT_FOUND: {
        code: 'EDU-COURSE-002',
        description: 'El curso con ID ${0} no fue encontrado',
    },
    COURSE_NOT_UPDATED: {
        code: 'EDU-COURSE-003',
        description: 'Error al actualizar el curso',
    },
    COURSE_NOT_REMOVED: {
        code: 'EDU-COURSE-004',
        description: 'Error al dar de baja al curso',
    },
    COURSE_DUPLICATE_CODE: {
        code: 'EDU-COURSE-005',
        description: 'Ya existe un curso con el código ${0}',
    },
    COURSE_SCHEDULE_OVERLAP: {
        code: 'EDU-COURSE-006',
        description: 'Existe un traslape de horario con otro curso',
    },
    COURSE_LIST_ERROR: {
        code: 'EDU-COURSE-007',
        description: 'Error al listar cursos',
    },
    CANNOT_UPDATE_FINALIZED: {
        code: 'EDU-COURSE-008',
        description: 'No se puede actualizar un curso finalizado',
    },
    COURSE_OVER_CAPACITY: {
        code: 'EDU-COURSE-009',
        description: 'El curso ha alcanzado su capacidad máxima',
    },
};
