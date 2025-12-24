export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export type CourseStatus = 'ACTIVO' | 'INACTIVO' | 'FINALIZADO';

export interface CourseSchedule {
    dayOfWeek: string;
    startTime: string;  // HH:mm
    endTime: string;    // HH:mm
}

export class CourseEntity {
    constructor(
        public readonly id: string,
        public readonly code: string,
        public readonly name: string,
        public readonly grade: string,
        public readonly section: string,
        public readonly subject: string,
        public readonly teacherName: string,
        public readonly teacherEmail: string,
        public readonly schedule: CourseSchedule[],
        public readonly capacity: number,
        public readonly enrolledCount: number,
        public readonly academicYear: number,
        public readonly semester: number,
        public readonly status: CourseStatus,
        public readonly createdAt: Date,
        public readonly createdBy: string,
        public readonly updatedAt?: Date,
        public readonly updatedBy?: string,
    ) {
        this.validateCode(code);
        this.validateName(name);
        this.validateGrade(grade);
        this.validateSection(section);
        this.validateSubject(subject);
        this.validateTeacherName(teacherName);
        this.validateTeacherEmail(teacherEmail);
        this.validateSchedule(schedule);
        this.validateCapacity(capacity, enrolledCount);
        this.validateAcademicYear(academicYear);
        this.validateSemester(semester);
        this.validateStatus(status);
    }

    private validateCode(code: string): void {
        // Format: MAT-8A-2025
        const codeRegex = /^[A-Z]{3}-[0-9]{1,2}[A-Z]{1,2}-[0-9]{4}$/;
        if (!codeRegex.test(code)) {
            throw new ValidationError(
                'Código debe tener formato: MAT-8A-2025',
            );
        }
    }

    private validateName(name: string): void {
        if (!name || name.trim().length < 3 || name.trim().length > 100) {
            throw new ValidationError(
                'Nombre del curso debe tener entre 3 y 100 caracteres',
            );
        }
    }

    private validateGrade(grade: string): void {
        const validGrades = [
            'Pre-kínder',
            'Kínder',
            '1° Básico',
            '2° Básico',
            '3° Básico',
            '4° Básico',
            '5° Básico',
            '6° Básico',
            '7° Básico',
            '8° Básico',
            '1° Medio',
            '2° Medio',
            '3° Medio',
            '4° Medio',
        ];

        if (!validGrades.includes(grade)) {
            throw new ValidationError(
                `Grado debe ser uno de: ${validGrades.join(', ')}`,
            );
        }
    }

    private validateSection(section: string): void {
        const sectionRegex = /^[A-Z]{1,2}$/;
        if (!sectionRegex.test(section)) {
            throw new ValidationError(
                'Sección debe ser una o dos letras mayúsculas (ej: A, B, AA)',
            );
        }
    }

    private validateSubject(subject: string): void {
        const validSubjects = [
            'Matemáticas',
            'Lenguaje',
            'Ciencias Naturales',
            'Historia',
            'Inglés',
            'Educación Física',
            'Artes',
            'Música',
            'Tecnología',
            'Religión',
            'Filosofía',
            'Biología',
            'Química',
            'Física',
        ];

        if (!validSubjects.includes(subject)) {
            throw new ValidationError(
                `Asignatura debe ser una de: ${validSubjects.join(', ')}`,
            );
        }
    }

    private validateTeacherName(name: string): void {
        if (!name || name.trim().length < 3 || name.trim().length > 100) {
            throw new ValidationError(
                'Nombre del profesor debe tener entre 3 y 100 caracteres',
            );
        }
    }

    private validateTeacherEmail(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError(
                'Email del profesor debe tener formato válido',
            );
        }
    }

    private validateSchedule(schedule: CourseSchedule[]): void {
        if (!schedule || schedule.length === 0) {
            throw new ValidationError(
                'El curso debe tener al menos un horario',
            );
        }

        const validDays = [
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado',
        ];

        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

        for (const slot of schedule) {
            if (!validDays.includes(slot.dayOfWeek)) {
                throw new ValidationError(
                    `Día debe ser uno de: ${validDays.join(', ')}`,
                );
            }

            if (!timeRegex.test(slot.startTime)) {
                throw new ValidationError(
                    'Hora de inicio debe tener formato HH:mm (00:00-23:59)',
                );
            }

            if (!timeRegex.test(slot.endTime)) {
                throw new ValidationError(
                    'Hora de término debe tener formato HH:mm (00:00-23:59)',
                );
            }

            const [startHour, startMin] = slot.startTime.split(':').map(Number);
            const [endHour, endMin] = slot.endTime.split(':').map(Number);
            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;

            if (startMinutes >= endMinutes) {
                throw new ValidationError(
                    'Hora de término debe ser posterior a hora de inicio',
                );
            }
        }
    }

    private validateCapacity(capacity: number, enrolledCount: number): void {
        if (capacity < 1 || capacity > 50) {
            throw new ValidationError(
                'Capacidad del curso debe estar entre 1 y 50 estudiantes',
            );
        }

        if (enrolledCount < 0) {
            throw new ValidationError(
                'Número de estudiantes matriculados no puede ser negativo',
            );
        }

        if (enrolledCount > capacity) {
            throw new ValidationError(
                'Número de matriculados no puede exceder la capacidad',
            );
        }
    }

    private validateAcademicYear(year: number): void {
        const currentYear = new Date().getFullYear();
        if (year < currentYear || year > currentYear + 5) {
            throw new ValidationError(
                `Año académico debe estar entre ${currentYear} y ${currentYear + 5}`,
            );
        }
    }

    private validateSemester(semester: number): void {
        if (semester !== 1 && semester !== 2) {
            throw new ValidationError('Semestre debe ser 1 o 2');
        }
    }

    private validateStatus(status: CourseStatus): void {
        const validStatuses: CourseStatus[] = ['ACTIVO', 'INACTIVO', 'FINALIZADO'];
        if (!validStatuses.includes(status)) {
            throw new ValidationError(
                `Estado debe ser uno de: ${validStatuses.join(', ')}`,
            );
        }
    }

    // Computed properties
    public get fullCode(): string {
        return this.code;
    }

    public get isActive(): boolean {
        return this.status === 'ACTIVO';
    }

    public get hasAvailableSeats(): boolean {
        return this.enrolledCount < this.capacity;
    }

    public get availableSeats(): number {
        return this.capacity - this.enrolledCount;
    }
}
