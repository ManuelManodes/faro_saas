import { ApiProperty } from '@nestjs/swagger';
import { StudentEntity } from '../../../domain/student/entity/student.entity';

export class EmergencyContactOutput {
    @ApiProperty({
        description: 'Nombre del contacto de emergencia',
        example: 'María González López',
    })
    name: string;

    @ApiProperty({
        description: 'Teléfono del contacto',
        example: '+56987654321',
    })
    phone: string;

    @ApiProperty({
        description: 'Relación con el estudiante',
        example: 'madre',
    })
    relationship: string;
}

export class StudentOutput {
    @ApiProperty({
        description: 'ID único del estudiante',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    })
    id: string;

    @ApiProperty({
        description: 'RUT chileno del estudiante',
        example: '12345678-5',
    })
    rut: string;

    @ApiProperty({
        description: 'Nombre(s) del estudiante',
        example: 'Juan Carlos',
    })
    firstName: string;

    @ApiProperty({
        description: 'Apellido(s) del estudiante',
        example: 'Pérez González',
    })
    lastName: string;

    @ApiProperty({
        description: 'Nombre completo del estudiante',
        example: 'Juan Carlos Pérez González',
    })
    fullName: string;

    @ApiProperty({
        description: 'Correo electrónico',
        example: 'juan.perez@estudiante.cl',
    })
    email: string;

    @ApiProperty({
        description: 'Teléfono',
        example: '+56912345678',
    })
    phone: string;

    @ApiProperty({
        description: 'Fecha de nacimiento',
        example: '2010-03-15',
        format: 'date',
    })
    birthDate: string;

    @ApiProperty({
        description: 'Edad calculada del estudiante',
        example: 14,
        type: Number,
    })
    age: number;

    @ApiProperty({
        description: 'Grado educativo',
        example: '8° Básico',
    })
    grade: string;

    @ApiProperty({
        description: 'Sección del curso',
        example: 'A',
    })
    section: string;

    @ApiProperty({
        description: 'Dirección de residencia',
        example: 'Av. Principal 123, Santiago',
    })
    address: string;

    @ApiProperty({
        description: 'Contacto de emergencia',
        type: EmergencyContactOutput,
    })
    emergencyContact: EmergencyContactOutput;

    @ApiProperty({
        description: 'Estado del estudiante',
        example: 'ACTIVO',
        enum: ['ACTIVO', 'INACTIVO', 'RETIRADO'],
    })
    status: string;

    @ApiProperty({
        description: 'Fecha de matrícula',
        example: '2020-03-01',
        format: 'date',
    })
    enrollmentDate: string;

    @ApiProperty({
        description: 'Fecha de creación del registro',
        example: '2024-01-15T10:00:00.000Z',
        format: 'date-time',
    })
    createdAt: string;

    @ApiProperty({
        description: 'Email del usuario que creó el registro',
        example: 'admin@colegio.cl',
    })
    createdBy: string;

    @ApiProperty({
        description: 'Fecha de última actualización',
        example: '2024-06-20T15:30:00.000Z',
        format: 'date-time',
        required: false,
    })
    updatedAt?: string;

    @ApiProperty({
        description: 'Email del usuario que actualizó el registro',
        example: 'admin@colegio.cl',
        required: false,
    })
    updatedBy?: string;
}

export function mapEntityToOutput(entity: StudentEntity): StudentOutput {
    return {
        id: entity.id,
        rut: entity.rut,
        firstName: entity.firstName,
        lastName: entity.lastName,
        fullName: entity.fullName,
        email: entity.email,
        phone: entity.phone,
        birthDate: entity.birthDate.toISOString().split('T')[0],
        age: entity.age,
        grade: entity.grade,
        section: entity.section,
        address: entity.address,
        emergencyContact: {
            name: entity.emergencyContact.name,
            phone: entity.emergencyContact.phone,
            relationship: entity.emergencyContact.relationship,
        },
        status: entity.status,
        enrollmentDate: entity.enrollmentDate.toISOString().split('T')[0],
        createdAt: entity.createdAt.toISOString(),
        createdBy: entity.createdBy,
        updatedAt: entity.updatedAt?.toISOString(),
        updatedBy: entity.updatedBy,
    };
}
