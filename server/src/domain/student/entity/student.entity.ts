export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export type StudentStatus = 'ACTIVO' | 'INACTIVO' | 'RETIRADO';

export interface EmergencyContact {
    name: string;
    phone: string;
    relationship: string;
}

export class StudentEntity {
    constructor(
        public readonly id: string,
        public readonly rut: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly birthDate: Date,
        public readonly grade: string,
        public readonly section: string,
        public readonly address: string,
        public readonly emergencyContact: EmergencyContact,
        public readonly status: StudentStatus,
        public readonly enrollmentDate: Date,
        public readonly createdAt: Date,
        public readonly createdBy: string,
        public readonly updatedAt?: Date,
        public readonly updatedBy?: string,
    ) {
        this.validateRut(rut);
        this.validateName(firstName, 'firstName');
        this.validateName(lastName, 'lastName');
        this.validateEmail(email);
        this.validatePhone(phone);
        this.validateAge(birthDate);
        this.validateGrade(grade);
        this.validateSection(section);
        this.validateAddress(address);
        this.validateEmergencyContact(emergencyContact);
        this.validateStatus(status);
    }

    private validateRut(rut: string): void {
        // Format: 12345678-9 or 12345678-K
        const rutRegex = /^\d{7,8}-[0-9Kk]$/;
        if (!rutRegex.test(rut)) {
            throw new ValidationError(
                'RUT debe tener formato válido: 12345678-9',
            );
        }

        // Validate check digit
        const [rutNumber, checkDigit] = rut.split('-');
        const calculatedDigit = this.calculateRutCheckDigit(rutNumber);

        if (checkDigit.toUpperCase() !== calculatedDigit.toUpperCase()) {
            throw new ValidationError('RUT inválido: dígito verificador incorrecto');
        }
    }

    private calculateRutCheckDigit(rutNumber: string): string {
        let sum = 0;
        let multiplier = 2;

        // Calculate from right to left
        for (let i = rutNumber.length - 1; i >= 0; i--) {
            sum += parseInt(rutNumber[i]) * multiplier;
            multiplier = multiplier === 7 ? 2 : multiplier + 1;
        }

        const remainder = sum % 11;
        const digit = 11 - remainder;

        if (digit === 11) return '0';
        if (digit === 10) return 'K';
        return digit.toString();
    }

    private validateName(name: string, field: string): void {
        if (!name || name.trim().length < 2 || name.trim().length > 100) {
            throw new ValidationError(
                `${field} debe tener entre 2 y 100 caracteres`,
            );
        }
    }

    private validateEmail(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError('Email debe tener formato válido');
        }
    }

    private validatePhone(phone: string): void {
        const phoneRegex = /^\+56\d{9}$/;
        if (!phoneRegex.test(phone)) {
            throw new ValidationError(
                'Teléfono debe tener formato +56XXXXXXXXX (9 dígitos)',
            );
        }
    }

    private validateAge(birthDate: Date): void {
        const now = new Date();
        const age = now.getFullYear() - birthDate.getFullYear();
        const monthDiff = now.getMonth() - birthDate.getMonth();
        const dayDiff = now.getDate() - birthDate.getDate();

        let actualAge = age;
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            actualAge--;
        }

        if (actualAge < 4 || actualAge > 25) {
            throw new ValidationError(
                'La edad del estudiante debe estar entre 4 y 25 años',
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

    private validateAddress(address: string): void {
        if (!address || address.trim().length < 5 || address.trim().length > 200) {
            throw new ValidationError('Dirección debe tener entre 5 y 200 caracteres');
        }
    }

    private validateEmergencyContact(contact: EmergencyContact): void {
        if (!contact.name || contact.name.trim().length < 3 || contact.name.trim().length > 100) {
            throw new ValidationError(
                'Nombre de contacto de emergencia debe tener entre 3 y 100 caracteres',
            );
        }

        const phoneRegex = /^\+56\d{9}$/;
        if (!phoneRegex.test(contact.phone)) {
            throw new ValidationError(
                'Teléfono de contacto debe tener formato +56XXXXXXXXX (9 dígitos)',
            );
        }

        if (!contact.relationship || contact.relationship.trim().length < 3) {
            throw new ValidationError(
                'Relación de contacto de emergencia debe especificarse',
            );
        }
    }

    private validateStatus(status: StudentStatus): void {
        const validStatuses: StudentStatus[] = ['ACTIVO', 'INACTIVO', 'RETIRADO'];
        if (!validStatuses.includes(status)) {
            throw new ValidationError(
                `Estado debe ser uno de: ${validStatuses.join(', ')}`,
            );
        }
    }

    // Computed properties
    public get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    public get age(): number {
        const now = new Date();
        const age = now.getFullYear() - this.birthDate.getFullYear();
        const monthDiff = now.getMonth() - this.birthDate.getMonth();
        const dayDiff = now.getDate() - this.birthDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            return age - 1;
        }
        return age;
    }

    public get isActive(): boolean {
        return this.status === 'ACTIVO';
    }
}
