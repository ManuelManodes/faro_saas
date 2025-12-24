import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsDateString,
    IsBoolean,
    IsOptional,
    IsArray,
    IsIn,
    IsEmail,
    MinLength,
    MaxLength,
} from 'class-validator';

export class CreateCalendarEventInput {
    @ApiProperty({
        description: 'Título del evento',
        example: 'Prueba de Matemáticas - 8° Básico',
        minLength: 3,
        maxLength: 200,
    })
    @IsString({ message: 'El título debe ser un texto' })
    @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
    @MaxLength(200, { message: 'El título no puede exceder 200 caracteres' })
    title: string;

    @ApiProperty({
        description: 'Descripción del evento',
        example:
            'Evaluación del segundo semestre que cubre álgebra y geometría',
        minLength: 10,
        maxLength: 1000,
    })
    @IsString({ message: 'La descripción debe ser un texto' })
    @MinLength(10, {
        message: 'La descripción debe tener al menos 10 caracteres',
    })
    @MaxLength(1000, {
        message: 'La descripción no puede exceder 1000 caracteres',
    })
    description: string;

    @ApiProperty({
        description: 'Tipo de evento',
        example: 'EVALUACION',
        enum: [
            'FERIADO',
            'EVALUACION',
            'REUNION',
            'EVENTO_INSTITUCIONAL',
            'ACTIVIDAD_EXTRACURRICULAR',
            'VACACIONES',
        ],
    })
    @IsString({ message: 'El tipo de evento debe ser un texto' })
    @IsIn(
        [
            'FERIADO',
            'EVALUACION',
            'REUNION',
            'EVENTO_INSTITUCIONAL',
            'ACTIVIDAD_EXTRACURRICULAR',
            'VACACIONES',
        ],
        {
            message:
                'El tipo debe ser FERIADO, EVALUACION, REUNION, EVENTO_INSTITUCIONAL, ACTIVIDAD_EXTRACURRICULAR o VACACIONES',
        },
    )
    eventType: string;

    @ApiProperty({
        description: 'Fecha de inicio (ISO 8601)',
        example: '2025-02-15',
    })
    @IsDateString({}, { message: 'La fecha de inicio debe tener formato ISO 8601' })
    startDate: string;

    @ApiProperty({
        description: 'Fecha de fin (ISO 8601)',
        example: '2025-02-15',
    })
    @IsDateString({}, { message: 'La fecha de fin debe tener formato ISO 8601' })
    endDate: string;

    @ApiProperty({
        description: 'Hora de inicio (HH:mm)',
        example: '14:00',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'La hora de inicio debe ser un texto' })
    startTime?: string;

    @ApiProperty({
        description: 'Hora de fin (HH:mm)',
        example: '16:00',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'La hora de fin debe ser un texto' })
    endTime?: string;

    @ApiProperty({
        description: 'Ubicación del evento',
        example: 'Sala 201, Edificio Principal',
        required: false,
        maxLength: 300,
    })
    @IsOptional()
    @IsString({ message: 'La ubicación debe ser un texto' })
    @MaxLength(300, {
        message: 'La ubicación no puede exceder 300 caracteres',
    })
    location?: string;

    @ApiProperty({
        description: 'ID del curso (para evaluaciones)',
        example: '507f1f77bcf86cd799439011',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'El ID del curso debe ser un texto' })
    courseId?: string;

    @ApiProperty({
        description: 'Evento de todo el día',
        example: true,
        default: true,
    })
    @IsBoolean({ message: 'isAllDay debe ser un booleano' })
    isAllDay: boolean;

    @ApiProperty({
        description: 'Estado del evento',
        example: 'PROGRAMADO',
        enum: ['PROGRAMADO', 'CONFIRMADO', 'CANCELADO', 'COMPLETADO'],
        default: 'PROGRAMADO',
    })
    @IsString({ message: 'El estado debe ser un texto' })
    @IsIn(['PROGRAMADO', 'CONFIRMADO', 'CANCELADO', 'COMPLETADO'], {
        message:
            'El estado debe ser PROGRAMADO, CONFIRMADO, CANCELADO o COMPLETADO',
    })
    status: string;

    @ApiProperty({
        description: 'Email del organizador',
        example: 'director@colegio.cl',
    })
    @IsEmail({}, { message: 'Debe ser un email válido' })
    organizerEmail: string;

    @ApiProperty({
        description: 'Lista de emails de asistentes',
        example: ['profesor1@colegio.cl', 'profesor2@colegio.cl'],
        required: false,
        type: [String],
    })
    @IsOptional()
    @IsArray({ message: 'Los asistentes deben ser un arreglo' })
    @IsEmail({}, { each: true, message: 'Cada asistente debe ser un email válido' })
    attendees?: string[];
}
