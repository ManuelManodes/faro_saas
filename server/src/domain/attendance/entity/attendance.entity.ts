export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export type AttendanceStatus = 'PRESENTE' | 'AUSENTE' | 'TARDE' | 'JUSTIFICADO';

export class AttendanceEntity {
    constructor(
        public readonly id: string,
        public readonly studentId: string,
        public readonly courseId: string,
        public readonly date: Date,
        public readonly status: AttendanceStatus,
        public readonly arrivalTime: string | undefined,
        public readonly notes: string | undefined,
        public readonly justificationDocument: string | undefined,
        public readonly recordedBy: string,
        public readonly createdAt: Date,
        public readonly createdBy: string,
        public readonly updatedAt?: Date,
        public readonly updatedBy?: string,
    ) {
        this.validateStudentId(studentId);
        this.validateCourseId(courseId);
        this.validateDate(date);
        this.validateStatus(status);
        this.validateArrivalTime(status, arrivalTime);
        this.validateJustification(status, notes);
        this.validateRecordedBy(recordedBy);
    }

    private validateStudentId(studentId: string): void {
        if (!studentId || studentId.trim().length === 0) {
            throw new ValidationError('ID del estudiante es obligatorio');
        }
    }

    private validateCourseId(courseId: string): void {
        if (!courseId || courseId.trim().length === 0) {
            throw new ValidationError('ID del curso es obligatorio');
        }
    }

    private validateDate(date: Date): void {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new ValidationError('Fecha inválida');
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);

        if (checkDate > now) {
            throw new ValidationError('La fecha no puede ser futura');
        }

        // No permitir registros de más de 1 año atrás
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        oneYearAgo.setHours(0, 0, 0, 0);

        if (checkDate < oneYearAgo) {
            throw new ValidationError(
                'No se pueden registrar asistencias de hace más de 1 año',
            );
        }
    }

    private validateStatus(status: AttendanceStatus): void {
        const validStatuses: AttendanceStatus[] = [
            'PRESENTE',
            'AUSENTE',
            'TARDE',
            'JUSTIFICADO',
        ];
        if (!validStatuses.includes(status)) {
            throw new ValidationError(
                `Estado debe ser uno de: ${validStatuses.join(', ')}`,
            );
        }
    }

    private validateArrivalTime(
        status: AttendanceStatus,
        arrivalTime: string | undefined,
    ): void {
        if (status === 'TARDE') {
            if (!arrivalTime) {
                throw new ValidationError(
                    'Hora de llegada es obligatoria cuando el estado es TARDE',
                );
            }

            const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(arrivalTime)) {
                throw new ValidationError(
                    'Hora de llegada debe tener formato HH:mm (00:00-23:59)',
                );
            }
        }
    }

    private validateJustification(
        status: AttendanceStatus,
        notes: string | undefined,
    ): void {
        if (status === 'JUSTIFICADO') {
            if (!notes || notes.trim().length === 0) {
                throw new ValidationError(
                    'Observaciones son obligatorias cuando el estado es JUSTIFICADO',
                );
            }

            if (notes.trim().length < 10) {
                throw new ValidationError(
                    'Las observaciones deben tener al menos 10 caracteres',
                );
            }
        }

        if (notes && notes.length > 500) {
            throw new ValidationError(
                'Las observaciones no pueden exceder 500 caracteres',
            );
        }
    }

    private validateRecordedBy(recordedBy: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recordedBy)) {
            throw new ValidationError(
                'Email del registrador debe tener formato válido',
            );
        }
    }

    // Computed properties
    public get isPresent(): boolean {
        return this.status === 'PRESENTE' || this.status === 'TARDE';
    }

    public get isAbsent(): boolean {
        return this.status === 'AUSENTE';
    }

    public get isJustified(): boolean {
        return this.status === 'JUSTIFICADO';
    }
}
