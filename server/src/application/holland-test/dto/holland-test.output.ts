import { ApiProperty } from '@nestjs/swagger';
import {
    HollandTestEntity,
    RIASECScores,
} from '../../../domain/holland-test/entity/holland-test.entity';

export class RIASECScoresOutput {
    @ApiProperty({ example: 75 })
    realistic: number;

    @ApiProperty({ example: 85 })
    investigative: number;

    @ApiProperty({ example: 60 })
    artistic: number;

    @ApiProperty({ example: 70 })
    social: number;

    @ApiProperty({ example: 55 })
    enterprising: number;

    @ApiProperty({ example: 50 })
    conventional: number;
}

export class HollandTestOutput {
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    id: string;

    @ApiProperty({ example: '507f1f77bcf86cd799439012' })
    studentId: string;

    @ApiProperty({ example: '2025-01-20' })
    testDate: string;

    @ApiProperty({ type: RIASECScoresOutput })
    scores: RIASECScoresOutput;

    @ApiProperty({ example: ['I', 'R', 'A'] })
    dominantTypes: string[];

    @ApiProperty({ example: 'IRA', description: 'Código Holland (3 letras)' })
    hollandCode: string;

    @ApiProperty({
        example:
            'El estudiante muestra alta orientación investigativa...',
    })
    interpretation: string;

    @ApiProperty({
        example: ['Ingeniería de Software', 'Ciencias de la Computación'],
    })
    recommendations: string[];

    @ApiProperty({ example: 'COMPLETADO' })
    status: string;

    @ApiProperty({ example: 'orientador@colegio.cl' })
    administeredBy: string;

    @ApiProperty({ example: '2025-01-20T10:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: 'admin@colegio.cl' })
    createdBy: string;

    @ApiProperty({ example: '2025-01-21T15:30:00.000Z', required: false })
    updatedAt?: string;

    @ApiProperty({ example: 'admin@colegio.cl', required: false })
    updatedBy?: string;
}

export function mapEntityToOutput(
    entity: HollandTestEntity,
): HollandTestOutput {
    return {
        id: entity.id,
        studentId: entity.studentId,
        testDate: entity.testDate.toISOString().split('T')[0],
        scores: {
            realistic: entity.scores.realistic,
            investigative: entity.scores.investigative,
            artistic: entity.scores.artistic,
            social: entity.scores.social,
            enterprising: entity.scores.enterprising,
            conventional: entity.scores.conventional,
        },
        dominantTypes: entity.dominantTypes,
        hollandCode: entity.hollandCode,
        interpretation: entity.interpretation,
        recommendations: entity.recommendations,
        status: entity.status,
        administeredBy: entity.administeredBy,
        createdAt: entity.createdAt.toISOString(),
        createdBy: entity.createdBy,
        updatedAt: entity.updatedAt?.toISOString(),
        updatedBy: entity.updatedBy,
    };
}
