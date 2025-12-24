// Re-export ValidationError from entity
export { ValidationError } from './entity/calendar-event.entity';

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
    EVENT_NOT_CREATED: {
        code: 'EDU-EVENT-001',
        description: 'Error al crear el evento',
    },
    EVENT_NOT_FOUND: {
        code: 'EDU-EVENT-002',
        description: 'El evento con ID ${0} no fue encontrado',
    },
    EVENT_NOT_UPDATED: {
        code: 'EDU-EVENT-003',
        description: 'Error al actualizar el evento',
    },
    EVENT_NOT_DELETED: {
        code: 'EDU-EVENT-004',
        description: 'Error al eliminar el evento',
    },
    EVENT_LIST_ERROR: {
        code: 'EDU-EVENT-005',
        description: 'Error al listar eventos',
    },
    COURSE_NOT_EXISTS: {
        code: 'EDU-EVENT-006',
        description: 'El curso con ID ${0} no existe',
    },
    CANNOT_UPDATE_COMPLETED: {
        code: 'EDU-EVENT-007',
        description: 'No se puede actualizar un evento completado',
    },
};
