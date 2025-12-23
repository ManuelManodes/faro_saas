import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsEmail,
    IsDateString,
    IsIn,
    Matches,
    MinLength,
    MaxLength,
    IsOptional,
    IsNotEmptyObject,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EmergencyContactInput {
    @ApiProperty({
        description: 'Nombre completo del contacto de emergencia',
        example: 'María González López',
        minLength: 3,
        maxLength: 100,
    })
    @IsString({ message: 'El nombre del contacto debe ser un texto' })
    @MinLength(3, { message: 'El nombre del contacto debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El nombre del contacto no puede exceder 100 caracteres' })
    name: string;

    @ApiProperty({
        description: 'Teléfono del contacto de emergencia (formato chileno)',
        example: '+56987654321',
        pattern: '^\\+56\\d{9}$',
    })
    @IsString({ message: 'El teléfono debe ser un texto' })
    @Matches(/^\+56\d{9}$/, {
        message: 'El teléfono debe tener formato +56XXXXXXXXX (9 dígitos)',
    })
    phone: string;

    @ApiProperty({
        description: 'Relación con el estudiante',
        example: 'madre',
        examples: ['padre', 'madre', 'tutor', 'abuelo', 'tío'],
    })
    @IsString({ message: 'La relación debe ser un texto' })
    @MinLength(3, { message: 'La relación debe tener al menos 3 caracteres' })
    relationship: string;
}

export class CreateStudentInput {
    @ApiProperty({
        description: 'RUT chileno del estudiante (formato: 12345678-9)',
        example: '12345678-5',
        pattern: '^\\d{7,8}-[0-9Kk]$',
    })
    @IsString({ message: 'El RUT debe ser un texto' })
    @Matches(/^\d{7,8}-[0-9Kk]$/, {
        message: 'El RUT debe tener formato válido: 12345678-9',
    })
    rut: string;

    @ApiProperty({
        description: 'Nombre(s) del estudiante',
        example: 'Juan Carlos',
        minLength: 2,
        maxLength: 100,
    })
    @IsString({ message: 'El nombre debe ser un texto' })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    firstName: string;

    @ApiProperty({
        description: 'Apellido(s) del estudiante',
        example: 'Pérez González',
        minLength: 2,
        maxLength: 100,
    })
    @IsString({ message: 'El apellido debe ser un texto' })
    @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
    @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
    lastName: string;

    @ApiProperty({
        description: 'Correo electrónico del estudiante',
        example: 'juan.perez@estudiante.cl',
        format: 'email',
    })
    @IsEmail({}, { message: 'El correo debe tener formato válido' })
    email: string;

    @ApiProperty({
        description: 'Teléfono del estudiante (formato chileno)',
        example: '+56912345678',
        pattern: '^\\+56\\d{9}$',
    })
    @IsString({ message: 'El teléfono debe ser un texto' })
    @Matches(/^\+56\d{9}$/, {
        message: 'El teléfono debe tener formato +56XXXXXXXXX (9 dígitos)',
    })
    phone: string;

    @ApiProperty({
        description: 'Fecha de nacimiento del estudiante (ISO 8601)',
        example: '2010-03-15',
        format: 'date',
    })
    @IsDateString(
        {},
        { message: 'La fecha de nacimiento debe tener formato ISO 8601' },
    )
    birthDate: string;

    @ApiProperty({
        description: 'Grado educativo del estudiante',
        example: '8° Básico',
        enum: [
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
        ],
    })
    @IsString({ message: 'El grado debe ser un texto' })
    @IsIn(
        [
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
        ],
        { message: 'El grado debe ser un valor válido' },
    )
    grade: string;

    @ApiProperty({
        description: 'Sección del curso (una o dos letras mayúsculas)',
        example: 'A',
        pattern: '^[A-Z]{1,2}$',
    })
    @IsString({ message: 'La sección debe ser un texto' })
    @Matches(/^[A-Z]{1,2}$/, {
        message: 'La sección debe ser una o dos letras mayúsculas (ej: A, B, AA)',
    })
    section: string;

    @ApiProperty({
        description: 'Dirección de residencia del estudiante',
        example: 'Av. Principal 123, Depto 45, Santiago',
        minLength: 5,
        maxLength: 200,
    })
    @IsString({ message: 'La dirección debe ser un texto' })
    @MinLength(5, { message: 'La dirección debe tener al menos 5 caracteres' })
    @MaxLength(200, { message: 'La dirección no puede exceder 200 caracteres' })
    address: string;

    @ApiProperty({
        description: 'Información del contacto de emergencia',
        type: EmergencyContactInput,
    })
    @IsNotEmptyObject(
        {},
        { message: 'El contacto de emergencia es obligatorio' },
    )
    @ValidateNested({ message: 'Los datos del contacto de emergencia no son válidos' })
    @Type(() => EmergencyContactInput)
    emergencyContact: EmergencyContactInput;

    @ApiProperty({
        description: 'Fecha de matrícula del estudiante (ISO 8601)',
        example: '2020-03-01',
        format: 'date',
        required: false,
    })
    @IsOptional()
    @IsDateString(
        {},
        { message: 'La fecha de matrícula debe tener formato ISO 8601' },
    )
    enrollmentDate?: string;
}
