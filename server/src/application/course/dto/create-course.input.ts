import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsEmail,
    IsNumber,
    IsIn,
    Matches,
    MinLength,
    MaxLength,
    Min,
    Max,
    IsArray,
    ValidateNested,
    ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CourseScheduleInput {
    @ApiProperty({
        description: 'Día de la semana',
        example: 'Lunes',
        enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    })
    @IsString({ message: 'El día debe ser un texto' })
    @IsIn(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'], {
        message: 'Día debe ser Lunes, Martes, Miércoles, Jueves, Viernes o Sábado',
    })
    dayOfWeek: string;

    @ApiProperty({
        description: 'Hora de inicio (formato HH:mm)',
        example: '08:00',
        pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
    })
    @IsString({ message: 'Hora de inicio debe ser un texto' })
    @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Hora de inicio debe tener formato HH:mm (00:00-23:59)',
    })
    startTime: string;

    @ApiProperty({
        description: 'Hora de término (formato HH:mm)',
        example: '09:30',
        pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
    })
    @IsString({ message: 'Hora de término debe ser un texto' })
    @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Hora de término debe tener formato HH:mm (00:00-23:59)',
    })
    endTime: string;
}

export class CreateCourseInput {
    @ApiProperty({
        description: 'Código único del curso (formato: MAT-8A-2025)',
        example: 'MAT-8A-2025',
        pattern: '^[A-Z]{3}-[0-9]{1,2}[A-Z]{1,2}-[0-9]{4}$',
    })
    @IsString({ message: 'El código debe ser un texto' })
    @Matches(/^[A-Z]{3}-[0-9]{1,2}[A-Z]{1,2}-[0-9]{4}$/, {
        message: 'Código debe tener formato: MAT-8A-2025',
    })
    code: string;

    @ApiProperty({
        description: 'Nombre del curso',
        example: 'Matemáticas Avanzadas',
        minLength: 3,
        maxLength: 100,
    })
    @IsString({ message: 'El nombre debe ser un texto' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    name: string;

    @ApiProperty({
        description: 'Grado educativo',
        example: '8° Básico',
        enum: [
            'Pre-kínder', 'Kínder',
            '1° Básico', '2° Básico', '3° Básico', '4° Básico',
            '5° Básico', '6° Básico', '7° Básico', '8° Básico',
            '1° Medio', '2° Medio', '3° Medio', '4° Medio',
        ],
    })
    @IsString({ message: 'El grado debe ser un texto' })
    @IsIn([
        'Pre-kínder', 'Kínder',
        '1° Básico', '2° Básico', '3° Básico', '4° Básico',
        '5° Básico', '6° Básico', '7° Básico', '8° Básico',
        '1° Medio', '2° Medio', '3° Medio', '4° Medio',
    ], { message: 'El grado debe ser un valor válido' })
    grade: string;

    @ApiProperty({
        description: 'Sección del curso',
        example: 'A',
        pattern: '^[A-Z]{1,2}$',
    })
    @IsString({ message: 'La sección debe ser un texto' })
    @Matches(/^[A-Z]{1,2}$/, {
        message: 'La sección debe ser una o dos letras mayúsculas (ej: A, B, AA)',
    })
    section: string;

    @ApiProperty({
        description: 'Asignatura',
        example: 'Matemáticas',
        enum: [
            'Matemáticas', 'Lenguaje', 'Ciencias Naturales', 'Historia',
            'Inglés', 'Educación Física', 'Artes', 'Música',
            'Tecnología', 'Religión', 'Filosofía',
            'Biología', 'Química', 'Física',
        ],
    })
    @IsString({ message: 'La asignatura debe ser un texto' })
    @IsIn([
        'Matemáticas', 'Lenguaje', 'Ciencias Naturales', 'Historia',
        'Inglés', 'Educación Física', 'Artes', 'Música',
        'Tecnología', 'Religión', 'Filosofía',
        'Biología', 'Química', 'Física',
    ], { message: 'La asignatura debe ser un valor válido' })
    subject: string;

    @ApiProperty({
        description: 'Nombre completo del profesor',
        example: 'Carlos Rodríguez',
        minLength: 3,
        maxLength: 100,
    })
    @IsString({ message: 'El nombre del profesor debe ser un texto' })
    @MinLength(3, { message: 'El nombre del profesor debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El nombre del profesor no puede exceder 100 caracteres' })
    teacherName: string;

    @ApiProperty({
        description: 'Email del profesor',
        example: 'carlos.rodriguez@colegio.cl',
        format: 'email',
    })
    @IsEmail({}, { message: 'El email del profesor debe tener formato válido' })
    teacherEmail: string;

    @ApiProperty({
        description: 'Horarios del curso',
        type: [CourseScheduleInput],
        example: [
            { dayOfWeek: 'Lunes', startTime: '08:00', endTime: '09:30' },
            { dayOfWeek: 'Miércoles', startTime: '10:00', endTime: '11:30' },
        ],
    })
    @IsArray({ message: 'Los horarios deben ser un arreglo' })
    @ArrayMinSize(1, { message: 'Debe haber al menos un horario' })
    @ValidateNested({ each: true })
    @Type(() => CourseScheduleInput)
    schedule: CourseScheduleInput[];

    @ApiProperty({
        description: 'Capacidad máxima del curso',
        example: 35,
        minimum: 1,
        maximum: 50,
    })
    @IsNumber({}, { message: 'La capacidad debe ser un número' })
    @Min(1, { message: 'La capacidad mínima es 1 estudiante' })
    @Max(50, { message: 'La capacidad máxima es 50 estudiantes' })
    capacity: number;

    @ApiProperty({
        description: 'Año académico',
        example: 2025,
        minimum: 2025,
    })
    @IsNumber({}, { message: 'El año académico debe ser un número' })
    @Min(2025, { message: 'El año académico debe ser 2025 o posterior' })
    academicYear: number;

    @ApiProperty({
        description: 'Semestre (1 o 2)',
        example: 1,
        enum: [1, 2],
    })
    @IsNumber({}, { message: 'El semestre debe ser un número' })
    @IsIn([1, 2], { message: 'El semestre debe ser 1 o 2' })
    semester: number;
}
