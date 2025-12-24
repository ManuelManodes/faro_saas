import { ApiProperty } from '@nestjs/swagger';
import { CourseEntity, CourseSchedule } from '../../../domain/course/entity/course.entity';

export class CourseScheduleOutput {
    @ApiProperty({ example: 'Lunes' })
    dayOfWeek: string;

    @ApiProperty({ example: '08:00' })
    startTime: string;

    @ApiProperty({ example: '09:30' })
    endTime: string;
}

export class CourseOutput {
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    id: string;

    @ApiProperty({ example: 'MAT-8A-2025' })
    code: string;

    @ApiProperty({ example: 'Matemáticas Avanzadas' })
    name: string;

    @ApiProperty({ example: '8° Básico' })
    grade: string;

    @ApiProperty({ example: 'A' })
    section: string;

    @ApiProperty({ example: 'Matemáticas' })
    subject: string;

    @ApiProperty({ example: 'Carlos Rodríguez' })
    teacherName: string;

    @ApiProperty({ example: 'carlos.rodriguez@colegio.cl' })
    teacherEmail: string;

    @ApiProperty({ type: [CourseScheduleOutput] })
    schedule: CourseScheduleOutput[];

    @ApiProperty({ example: 35 })
    capacity: number;

    @ApiProperty({ example: 28 })
    enrolledCount: number;

    @ApiProperty({ example: 7 })
    availableSeats: number;

    @ApiProperty({ example: 2025 })
    academicYear: number;

    @ApiProperty({ example: 1 })
    semester: number;

    @ApiProperty({ example: 'ACTIVO' })
    status: string;

    @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: 'admin@colegio.cl' })
    createdBy: string;

    @ApiProperty({ example: '2025-02-20T15:30:00.000Z', required: false })
    updatedAt?: string;

    @ApiProperty({ example: 'admin@colegio.cl', required: false })
    updatedBy?: string;
}

export function mapEntityToOutput(entity: CourseEntity): CourseOutput {
    return {
        id: entity.id,
        code: entity.code,
        name: entity.name,
        grade: entity.grade,
        section: entity.section,
        subject: entity.subject,
        teacherName: entity.teacherName,
        teacherEmail: entity.teacherEmail,
        schedule: entity.schedule.map((s) => ({
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
        })),
        capacity: entity.capacity,
        enrolledCount: entity.enrolledCount,
        availableSeats: entity.availableSeats,
        academicYear: entity.academicYear,
        semester: entity.semester,
        status: entity.status,
        createdAt: entity.createdAt.toISOString(),
        createdBy: entity.createdBy,
        updatedAt: entity.updatedAt?.toISOString(),
        updatedBy: entity.updatedBy,
    };
}
