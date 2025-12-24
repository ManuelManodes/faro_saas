import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsDateString,
    IsNumber,
    IsArray,
    IsIn,
    ValidateNested,
    Min,
    Max,
    MinLength,
    MaxLength,
    ArrayMinSize,
    ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RIASECScoresInput {
    @ApiProperty({
        description: 'Puntuación Realista (0-100)',
        example: 75,
        minimum: 0,
        maximum: 100,
    })
    @IsNumber({}, { message: 'La puntuación realista debe ser un número' })
    @Min(0, { message: 'La puntuación realista mínima es 0' })
    @Max(100, { message: 'La puntuación realista máxima es 100' })
    realistic: number;

    @ApiProperty({
        description: 'Puntuación Investigador (0-100)',
        example: 85,
        minimum: 0,
        maximum: 100,
    })
    @IsNumber({}, { message: 'La puntuación investigador debe ser un número' })
    @Min(0, { message: 'La puntuación investigador mínima es 0' })
    @Max(100, { message: 'La puntuación investigador máxima es 100' })
    investigative: number;

    @ApiProperty({
        description: 'Puntuación Artístico (0-100)',
        example: 60,
        minimum: 0,
        maximum: 100,
    })
    @IsNumber({}, { message: 'La puntuación artístico debe ser un número' })
    @Min(0, { message: 'La puntuación artístico mínima es 0' })
    @Max(100, { message: 'La puntuación artístico máxima es 100' })
    artistic: number;

    @ApiProperty({
        description: 'Puntuación Social (0-100)',
        example: 70,
        minimum: 0,
        maximum: 100,
    })
    @IsNumber({}, { message: 'La puntuación social debe ser un número' })
    @Min(0, { message: 'La puntuación social mínima es 0' })
    @Max(100, { message: 'La puntuación social máxima es 100' })
    social: number;

    @ApiProperty({
        description: 'Puntuación Emprendedor (0-100)',
        example: 55,
        minimum: 0,
        maximum: 100,
    })
    @IsNumber({}, { message: 'La puntuación emprendedor debe ser un número' })
    @Min(0, { message: 'La puntuación emprendedor mínima es 0' })
    @Max(100, { message: 'La puntuación emprendedor máxima es 100' })
    enterprising: number;

    @ApiProperty({
        description: 'Puntuación Convencional (0-100)',
        example: 50,
        minimum: 0,
        maximum: 100,
    })
    @IsNumber({}, { message: 'La puntuación convencional debe ser un número' })
    @Min(0, { message: 'La puntuación convencional mínima es 0' })
    @Max(100, { message: 'La puntuación convencional máxima es 100' })
    conventional: number;
}

export class CreateHollandTestInput {
    @ApiProperty({
        description: 'ID del estudiante (MongoDB ObjectId)',
        example: '507f1f77bcf86cd799439011',
    })
    @IsString({ message: 'El ID del estudiante debe ser un texto' })
    studentId: string;

    @ApiProperty({
        description: 'Fecha del test (ISO 8601)',
        example: '2025-01-20',
    })
    @IsDateString({}, { message: 'La fecha debe tener formato ISO 8601' })
    testDate: string;

    @ApiProperty({
        description: 'Puntuaciones RIASEC',
        type: RIASECScoresInput,
    })
    @ValidateNested()
    @Type(() => RIASECScoresInput)
    scores: RIASECScoresInput;

    @ApiProperty({
        description: 'Tipos dominantes (top 3, ordenados)',
        example: ['I', 'R', 'A'],
        minItems: 3,
        maxItems: 3,
    })
    @IsArray({ message: 'Los tipos dominantes deben ser un arreglo' })
    @ArrayMinSize(3, { message: 'Debe haber exactamente 3 tipos dominantes' })
    @ArrayMaxSize(3, { message: 'Debe haber exactamente 3 tipos dominantes' })
    @IsString({ each: true, message: 'Cada tipo debe ser un texto' })
    @IsIn(['R', 'I', 'A', 'S', 'E', 'C'], {
        each: true,
        message: 'Cada tipo debe ser R, I, A, S, E o C',
    })
    dominantTypes: string[];

    @ApiProperty({
        description: 'Interpretación del test',
        example:
            'El estudiante muestra alta orientación investigativa, con fuerte inclinación por el pensamiento abstracto y la resolución de problemas científicos...',
        minLength: 20,
        maxLength: 2000,
    })
    @IsString({ message: 'La interpretación debe ser un texto' })
    @MinLength(20, {
        message: 'La interpretación debe tener al menos 20 caracteres',
    })
    @MaxLength(2000, {
        message: 'La interpretación no puede exceder 2000 caracteres',
    })
    interpretation: string;

    @ApiProperty({
        description: 'Recomendaciones de carreras',
        example: [
            'Ingeniería de Software',
            'Ciencias de la Computación',
            'Física',
        ],
        minItems: 1,
        maxItems: 10,
    })
    @IsArray({ message: 'Las recomendaciones deben ser un arreglo' })
    @ArrayMinSize(1, { message: 'Debe haber al menos 1 recomendación' })
    @ArrayMaxSize(10, { message: 'No puede haber más de 10 recomendaciones' })
    @IsString({ each: true, message: 'Cada recomendación debe ser un texto' })
    @MinLength(5, {
        each: true,
        message: 'Cada recomendación debe tener al menos 5 caracteres',
    })
    @MaxLength(200, {
        each: true,
        message: 'Cada recomendación no puede exceder 200 caracteres',
    })
    recommendations: string[];

    @ApiProperty({
        description: 'Estado del test',
        example: 'COMPLETADO',
        enum: ['COMPLETADO', 'INCOMPLETO', 'INVALIDADO'],
    })
    @IsString({ message: 'El estado debe ser un texto' })
    @IsIn(['COMPLETADO', 'INCOMPLETO', 'INVALIDADO'], {
        message: 'El estado debe ser COMPLETADO, INCOMPLETO o INVALIDADO',
    })
    status: string;

    @ApiProperty({
        description: 'Email de quien administró el test',
        example: 'orientador@colegio.cl',
    })
    @IsString({ message: 'El email debe ser un texto' })
    administeredBy: string;
}
