import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkAttendanceStudentInput {
    @ApiProperty({
        description: 'ID del estudiante',
        example: '507f1f77bcf86cd799439011',
    })
    @IsString({ message: 'El ID del estudiante debe ser un texto' })
    studentId: string;

    @ApiProperty({
        description: 'Estado de asistencia',
        example: 'PRESENTE',
        enum: ['PRESENTE', 'AUSENTE', 'TARDE', 'JUSTIFICADO'],
    })
    @IsString({ message: 'El estado debe ser un texto' })
    @IsIn(['PRESENTE', 'AUSENTE', 'TARDE', 'JUSTIFICADO'])
    status: string;

    @ApiProperty({
        description: 'Hora de llegada (solo si status es TARDE)',
        example: '08:45',
        required: false,
    })
    @IsString()
    arrivalTime?: string;

    @ApiProperty({
        description: 'Observaciones (obligatorio si status es JUSTIFICADO)',
        example: 'Certificado médico',
        required: false,
    })
    @IsString()
    notes?: string;
}

export class BulkAttendanceInput {
    @ApiProperty({
        description: 'ID del curso',
        example: '507f191e810c19729de860ea',
    })
    @IsString({ message: 'El ID del curso debe ser un texto' })
    courseId: string;

    @ApiProperty({
        description: 'Fecha de la clase',
        example: '2025-01-15',
    })
    @IsString({ message: 'La fecha debe ser un texto' })
    date: string;

    @ApiProperty({
        description: 'Lista de asistencias de estudiantes',
        type: [BulkAttendanceStudentInput],
    })
    @IsArray({ message: 'Las asistencias deben ser un arreglo' })
    @ArrayMinSize(1, { message: 'Debe haber al menos un estudiante' })
    @ValidateNested({ each: true })
    @Type(() => BulkAttendanceStudentInput)
    attendances: BulkAttendanceStudentInput[];
}
