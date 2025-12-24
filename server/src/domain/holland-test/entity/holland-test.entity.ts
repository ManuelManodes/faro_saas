export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export interface RIASECScores {
    realistic: number;      // Realista (R)
    investigative: number;  // Investigador (I)
    artistic: number;       // Artístico (A)
    social: number;         // Social (S)
    enterprising: number;   // Emprendedor (E)
    conventional: number;   // Convencional (C)
}

export type HollandTestStatus = 'COMPLETADO' | 'INCOMPLETO' | 'INVALIDADO';

export class HollandTestEntity {
    constructor(
        public readonly id: string,
        public readonly studentId: string,
        public readonly testDate: Date,
        public readonly scores: RIASECScores,
        public readonly dominantTypes: string[], // Top 3 types (e.g., ['R', 'I', 'A'])
        public readonly interpretation: string,
        public readonly recommendations: string[],
        public readonly status: HollandTestStatus,
        public readonly administeredBy: string,
        public readonly createdAt: Date,
        public readonly createdBy: string,
        public readonly updatedAt?: Date,
        public readonly updatedBy?: string,
    ) {
        this.validateStudentId(studentId);
        this.validateTestDate(testDate);
        this.validateScores(scores);
        this.validateDominantTypes(dominantTypes, scores);
        this.validateInterpretation(interpretation);
        this.validateRecommendations(recommendations);
        this.validateStatus(status);
        this.validateAdministeredBy(administeredBy);
    }

    private validateStudentId(studentId: string): void {
        if (!studentId || studentId.trim().length === 0) {
            throw new ValidationError('ID del estudiante es obligatorio');
        }
    }

    private validateTestDate(testDate: Date): void {
        if (!(testDate instanceof Date) || isNaN(testDate.getTime())) {
            throw new ValidationError('Fecha del test inválida');
        }

        const now = new Date();
        if (testDate > now) {
            throw new ValidationError('La fecha del test no puede ser futura');
        }

        // No permitir tests de más de 5 años atrás
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

        if (testDate < fiveYearsAgo) {
            throw new ValidationError(
                'No se pueden registrar tests de hace más de 5 años',
            );
        }
    }

    private validateScores(scores: RIASECScores): void {
        const dimensions = [
            'realistic',
            'investigative',
            'artistic',
            'social',
            'enterprising',
            'conventional',
        ] as const;

        for (const dimension of dimensions) {
            const score = scores[dimension];

            if (typeof score !== 'number') {
                throw new ValidationError(
                    `Puntuación ${dimension} debe ser un número`,
                );
            }

            if (score < 0 || score > 100) {
                throw new ValidationError(
                    `Puntuación ${dimension} debe estar entre 0 y 100`,
                );
            }

            // Validar que sea entero
            if (!Number.isInteger(score)) {
                throw new ValidationError(
                    `Puntuación ${dimension} debe ser un número entero`,
                );
            }
        }
    }

    private validateDominantTypes(
        dominantTypes: string[],
        scores: RIASECScores,
    ): void {
        if (!Array.isArray(dominantTypes)) {
            throw new ValidationError('Tipos dominantes deben ser un arreglo');
        }

        if (dominantTypes.length !== 3) {
            throw new ValidationError('Debe haber exactamente 3 tipos dominantes');
        }

        const validTypes = ['R', 'I', 'A', 'S', 'E', 'C'];
        const uniqueTypes = new Set(dominantTypes);

        if (uniqueTypes.size !== 3) {
            throw new ValidationError('Los tipos dominantes deben ser únicos');
        }

        for (const type of dominantTypes) {
            if (!validTypes.includes(type)) {
                throw new ValidationError(
                    `Tipo dominante ${type} no es válido. Debe ser R, I, A, S, E o C`,
                );
            }
        }

        // Validar que los tipos dominantes correspondan a las 3 puntuaciones más altas
        const scoreEntries = [
            { type: 'R', score: scores.realistic },
            { type: 'I', score: scores.investigative },
            { type: 'A', score: scores.artistic },
            { type: 'S', score: scores.social },
            { type: 'E', score: scores.enterprising },
            { type: 'C', score: scores.conventional },
        ];

        const sortedByScore = scoreEntries.sort((a, b) => b.score - a.score);
        const expectedTop3 = sortedByScore.slice(0, 3).map((e) => e.type);

        // Verificar que dominantTypes contenga los 3 tipos con mayor puntuación
        const expectedSet = new Set(expectedTop3);
        const actualSet = new Set(dominantTypes);

        if (
            expectedSet.size !== actualSet.size ||
            ![...expectedSet].every((type) => actualSet.has(type))
        ) {
            throw new ValidationError(
                'Los tipos dominantes deben corresponder a las 3 puntuaciones más altas',
            );
        }
    }

    private validateInterpretation(interpretation: string): void {
        if (!interpretation || interpretation.trim().length === 0) {
            throw new ValidationError('La interpretación es obligatoria');
        }

        if (interpretation.trim().length < 20) {
            throw new ValidationError(
                'La interpretación debe tener al menos 20 caracteres',
            );
        }

        if (interpretation.length > 2000) {
            throw new ValidationError(
                'La interpretación no puede exceder 2000 caracteres',
            );
        }
    }

    private validateRecommendations(recommendations: string[]): void {
        if (!Array.isArray(recommendations)) {
            throw new ValidationError('Las recomendaciones deben ser un arreglo');
        }

        if (recommendations.length < 1) {
            throw new ValidationError('Debe haber al menos 1 recomendación');
        }

        if (recommendations.length > 10) {
            throw new ValidationError(
                'No puede haber más de 10 recomendaciones',
            );
        }

        for (const rec of recommendations) {
            if (!rec || rec.trim().length === 0) {
                throw new ValidationError(
                    'Las recomendaciones no pueden estar vacías',
                );
            }

            if (rec.trim().length < 5) {
                throw new ValidationError(
                    'Cada recomendación debe tener al menos 5 caracteres',
                );
            }

            if (rec.length > 200) {
                throw new ValidationError(
                    'Cada recomendación no puede exceder 200 caracteres',
                );
            }
        }
    }

    private validateStatus(status: HollandTestStatus): void {
        const validStatuses: HollandTestStatus[] = [
            'COMPLETADO',
            'INCOMPLETO',
            'INVALIDADO',
        ];

        if (!validStatuses.includes(status)) {
            throw new ValidationError(
                `Estado debe ser uno de: ${validStatuses.join(', ')}`,
            );
        }
    }

    private validateAdministeredBy(administeredBy: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(administeredBy)) {
            throw new ValidationError(
                'Email del administrador debe tener formato válido',
            );
        }
    }

    // Computed properties
    public get hollandCode(): string {
        return this.dominantTypes.join('');
    }

    public get isValid(): boolean {
        return this.status === 'COMPLETADO';
    }

    public get primaryType(): string {
        return this.dominantTypes[0];
    }

    public get secondaryType(): string {
        return this.dominantTypes[1];
    }

    public get tertiaryType(): string {
        return this.dominantTypes[2];
    }
}
