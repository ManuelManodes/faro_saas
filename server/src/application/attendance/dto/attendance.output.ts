import { ApiProperty } from '@nestjs/swagger';
import { AttendanceEntity } from '../../../domain/attendance/entity/attendance.entity';

export class AttendanceOutput {
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    id: string;

    @ApiProperty({ example: '507f1f77bcf86cd799439012' })
    studentId: string;

    @ApiProperty({ example: '507f1f77bcf86cd799439013' })
    courseId: string;

    @ApiProperty({ example: '2025-01-15' })
    date: string;

    @ApiProperty({ example: 'PRESENTE' })
    status: string;

    @ApiProperty({ example: '08:45', required: false })
    arrivalTime?: string;

    @ApiProperty({ example: 'Certificado médico presentado', required: false })
    notes?: string;

    @ApiProperty({
        example: 'https://storage.example.com/justifications/cert-123.pdf',
        required: false,
    })
    justificationDocument?: string;

    @ApiProperty({ example: 'profesor@colegio.cl' })
    recordedBy: string;

    @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: 'admin@colegio.cl' })
    createdBy: string;

    @ApiProperty({ example: '2025-01-15T15:30:00.000Z', required: false })
    updatedAt?: string;

    @ApiProperty({ example: 'admin@colegio.cl', required: false })
    updatedBy?: string;
}

export class AttendanceSummaryOutput {
    @ApiProperty({ example: 120 })
    total: number;

    @ApiProperty({ example: 100 })
    presente: number;

    @ApiProperty({ example: 10 })
    ausente: number;

    @ApiProperty({ example: 5 })
    tarde: number;

    @ApiProperty({ example: 5 })
    justificado: number;

    @ApiProperty({ example: 87.5, description: 'Porcentaje de asistencia' })
    attendanceRate: number;
}

export function mapEntityToOutput(entity: AttendanceEntity): AttendanceOutput {
    return {
        id: entity.id,
        studentId: entity.studentId,
        courseId: entity.courseId,
        date: entity.date.toISOString().split('T')[0],
        status: entity.status,
        arrivalTime: entity.arrivalTime,
        notes: entity.notes,
        justificationDocument: entity.justificationDocument,
        recordedBy: entity.recordedBy,
        createdAt: entity.createdAt.toISOString(),
        createdBy: entity.createdBy,
        updatedAt: entity.updatedAt?.toISOString(),
        updatedBy: entity.updatedBy,
    };
}
