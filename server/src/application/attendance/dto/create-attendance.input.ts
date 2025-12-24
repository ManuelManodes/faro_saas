import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsDateString,
    IsIn,
    IsOptional,
    Matches,
    MinLength,
    MaxLength,
} from 'class-validator';

export class CreateAttendanceInput {
    @ApiProperty({
        description: 'ID del estudiante (MongoDB ObjectId)',
        example: '507f1f77bcf86cd799439011',
    })
    @IsString({ message: 'El ID del estudiante debe ser un texto' })
    studentId: string;

    @ApiProperty({
        description: 'ID del curso (MongoDB ObjectId)',
        example: '507f191e810c19729de860ea',
    })
    @IsString({ message: 'El ID del curso debe ser un texto' })
    courseId: string;

    @ApiProperty({
        description: 'Fecha de la clase (ISO 8601)',
        example: '2025-01-15',
        format: 'date',
    })
    @IsDateString({}, { message: 'La fecha debe tener formato ISO 8601' })
    date: string;

    @ApiProperty({
        description: 'Estado de asistencia',
        example: 'PRESENTE',
        enum: ['PRESENTE', 'AUSENTE', 'TARDE', 'JUSTIFICADO'],
    })
    @IsString({ message: 'El estado debe ser un texto' })
    @IsIn(['PRESENTE', 'AUSENTE', 'TARDE', 'JUSTIFICADO'], {
        message: 'El estado debe ser: PRESENTE, AUSENTE, TARDE o JUSTIFICADO',
    })
    status: string;

    @ApiProperty({
        description: 'Hora de llegada (obligatoria si estado es TARDE)',
        example: '08:45',
        pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'La hora de llegada debe ser un texto' })
    @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'La hora de llegada debe tener formato HH:mm (00:00-23:59)',
    })
    arrivalTime?: string;

    @ApiProperty({
        description: 'Observaciones (obligatorias si estado es JUSTIFICADO)',
        example: 'Certificado médico presentado',
        minLength: 10,
        maxLength: 500,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Las observaciones deben ser un texto' })
    @MinLength(10, { message: 'Las observaciones deben tener al menos 10 caracteres' })
    @MaxLength(500, { message: 'Las observaciones no pueden exceder 500 caracteres' })
    notes?: string;

    @ApiProperty({
        description: 'URL del documento de justificación',
        example: 'https://storage.example.com/justifications/cert-123.pdf',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'El documento debe ser un texto' })
    justificationDocument?: string;
}
