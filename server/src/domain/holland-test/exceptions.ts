// Re-export ValidationError from entity
export { ValidationError } from './entity/holland-test.entity';

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
    HOLLAND_TEST_NOT_CREATED: {
        code: 'EDU-HOLLAND-001',
        description: 'Error al crear el registro de test de Holland',
    },
    HOLLAND_TEST_NOT_FOUND: {
        code: 'EDU-HOLLAND-002',
        description: 'El test de Holland con ID ${0} no fue encontrado',
    },
    STUDENT_NOT_EXISTS: {
        code: 'EDU-HOLLAND-003',
        description: 'El estudiante con ID ${0} no existe',
    },
    HOLLAND_TEST_NOT_UPDATED: {
        code: 'EDU-HOLLAND-004',
        description: 'Error al actualizar el test de Holland',
    },
    HOLLAND_TEST_NOT_DELETED: {
        code: 'EDU-HOLLAND-005',
        description: 'Error al eliminar el test de Holland',
    },
    HOLLAND_TEST_LIST_ERROR: {
        code: 'EDU-HOLLAND-006',
        description: 'Error al listar tests de Holland',
    },
    INVALID_SCORE_CALCULATION: {
        code: 'EDU-HOLLAND-007',
        description: 'Error en el cálculo de puntuaciones',
    },
};
