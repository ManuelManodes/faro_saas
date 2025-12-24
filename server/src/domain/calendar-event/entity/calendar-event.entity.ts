export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export type EventType =
    | 'FERIADO'
    | 'EVALUACION'
    | 'REUNION'
    | 'EVENTO_INSTITUCIONAL'
    | 'ACTIVIDAD_EXTRACURRICULAR'
    | 'VACACIONES';

export type EventStatus = 'PROGRAMADO' | 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO';

export class CalendarEventEntity {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly description: string,
        public readonly eventType: EventType,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly isAllDay: boolean,
        public readonly status: EventStatus,
        public readonly organizerEmail: string,
        public readonly attendees: string[],
        public readonly createdAt: Date,
        public readonly createdBy: string,
        public readonly startTime?: string, // Optional: HH:mm format
        public readonly endTime?: string, // Optional: HH:mm format
        public readonly location?: string,
        public readonly courseId?: string, // Optional: reference to Course for evaluations
        public readonly updatedAt?: Date,
        public readonly updatedBy?: string,
    ) {
        this.validateTitle(title);
        this.validateDescription(description);
        this.validateEventType(eventType);
        this.validateDates(startDate, endDate);
        this.validateTimes(startTime, endTime, isAllDay);
        this.validateLocation(location);
        this.validateStatus(status);
        this.validateOrganizerEmail(organizerEmail);
        this.validateAttendees(attendees);
    }

    private validateTitle(title: string): void {
        if (!title || title.trim().length === 0) {
            throw new ValidationError('El título es obligatorio');
        }

        if (title.trim().length < 3) {
            throw new ValidationError(
                'El título debe tener al menos 3 caracteres',
            );
        }

        if (title.length > 200) {
            throw new ValidationError(
                'El título no puede exceder 200 caracteres',
            );
        }
    }

    private validateDescription(description: string): void {
        if (!description || description.trim().length === 0) {
            throw new ValidationError('La descripción es obligatoria');
        }

        if (description.trim().length < 10) {
            throw new ValidationError(
                'La descripción debe tener al menos 10 caracteres',
            );
        }

        if (description.length > 1000) {
            throw new ValidationError(
                'La descripción no puede exceder 1000 caracteres',
            );
        }
    }

    private validateEventType(eventType: EventType): void {
        const validTypes: EventType[] = [
            'FERIADO',
            'EVALUACION',
            'REUNION',
            'EVENTO_INSTITUCIONAL',
            'ACTIVIDAD_EXTRACURRICULAR',
            'VACACIONES',
        ];

        if (!validTypes.includes(eventType)) {
            throw new ValidationError(
                `Tipo de evento debe ser uno de: ${validTypes.join(', ')}`,
            );
        }
    }

    private validateDates(startDate: Date, endDate: Date): void {
        if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
            throw new ValidationError('Fecha de inicio inválida');
        }

        if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
            throw new ValidationError('Fecha de fin inválida');
        }

        // End date must be >= start date
        if (endDate < startDate) {
            throw new ValidationError(
                'La fecha de fin debe ser posterior o igual a la fecha de inicio',
            );
        }

        // No permitir eventos de más de 1 año de duración
        const oneYearLater = new Date(startDate);
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

        if (endDate > oneYearLater) {
            throw new ValidationError(
                'El evento no puede durar más de 1 año',
            );
        }

        // Validar que la fecha de inicio no sea muy antigua (más de 5 años atrás)
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

        if (startDate < fiveYearsAgo) {
            throw new ValidationError(
                'No se pueden crear eventos de hace más de 5 años',
            );
        }
    }

    private validateTimes(
        startTime: string | undefined,
        endTime: string | undefined,
        isAllDay: boolean,
    ): void {
        if (isAllDay) {
            // Si es todo el día, no debería tener horas específicas
            if (startTime || endTime) {
                throw new ValidationError(
                    'Un evento de todo el día no debe tener horas específicas',
                );
            }
            return;
        }

        // Si no es todo el día, debe tener ambas horas
        if (!startTime || !endTime) {
            throw new ValidationError(
                'Un evento con horario debe tener hora de inicio y fin',
            );
        }

        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!timeRegex.test(startTime)) {
            throw new ValidationError(
                'Hora de inicio debe tener formato HH:mm (00:00 - 23:59)',
            );
        }

        if (!timeRegex.test(endTime)) {
            throw new ValidationError(
                'Hora de fin debe tener formato HH:mm (00:00 - 23:59)',
            );
        }

        // Convertir a minutos para comparar
        const startMinutes =
            parseInt(startTime.split(':')[0]) * 60 +
            parseInt(startTime.split(':')[1]);
        const endMinutes =
            parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

        if (endMinutes <= startMinutes) {
            throw new ValidationError(
                'La hora de fin debe ser posterior a la hora de inicio',
            );
        }
    }

    private validateLocation(location: string | undefined): void {
        if (location && location.length > 300) {
            throw new ValidationError(
                'La ubicación no puede exceder 300 caracteres',
            );
        }

        if (location && location.trim().length < 3 && location.trim().length > 0) {
            throw new ValidationError(
                'La ubicación debe tener al menos 3 caracteres',
            );
        }
    }

    private validateStatus(status: EventStatus): void {
        const validStatuses: EventStatus[] = [
            'PROGRAMADO',
            'CONFIRMADO',
            'CANCELADO',
            'COMPLETADO',
        ];

        if (!validStatuses.includes(status)) {
            throw new ValidationError(
                `Estado debe ser uno de: ${validStatuses.join(', ')}`,
            );
        }
    }

    private validateOrganizerEmail(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError(
                'Email del organizador debe tener formato válido',
            );
        }
    }

    private validateAttendees(attendees: string[]): void {
        if (!Array.isArray(attendees)) {
            throw new ValidationError('Los asistentes deben ser un arreglo');
        }

        if (attendees.length > 500) {
            throw new ValidationError(
                'No puede haber más de 500 asistentes',
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        for (const attendee of attendees) {
            if (!emailRegex.test(attendee)) {
                throw new ValidationError(
                    `Email de asistente inválido: ${attendee}`,
                );
            }
        }

        // Verificar que no haya duplicados
        const uniqueAttendees = new Set(attendees);
        if (uniqueAttendees.size !== attendees.length) {
            throw new ValidationError('No puede haber asistentes duplicados');
        }
    }

    // Computed properties
    public get isActive(): boolean {
        return this.status !== 'CANCELADO';
    }

    public get isPast(): boolean {
        const now = new Date();
        return this.endDate < now;
    }

    public get isFuture(): boolean {
        const now = new Date();
        return this.startDate > now;
    }

    public get isOngoing(): boolean {
        const now = new Date();
        return this.startDate <= now && this.endDate >= now;
    }

    public get durationInDays(): number {
        const diffTime = this.endDate.getTime() - this.startDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both days
    }
}
