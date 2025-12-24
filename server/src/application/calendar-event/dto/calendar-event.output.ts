import { ApiProperty } from '@nestjs/swagger';
import { CalendarEventEntity } from '../../../domain/calendar-event/entity/calendar-event.entity';

export class CalendarEventOutput {
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    id: string;

    @ApiProperty({ example: 'Prueba de Matemáticas - 8° Básico' })
    title: string;

    @ApiProperty({
        example: 'Evaluación del segundo semestre',
    })
    description: string;

    @ApiProperty({ example: 'EVALUACION' })
    eventType: string;

    @ApiProperty({ example: '2025-02-15' })
    startDate: string;

    @ApiProperty({ example: '2025-02-15' })
    endDate: string;

    @ApiProperty({ example: '14:00', required: false })
    startTime?: string;

    @ApiProperty({ example: '16:00', required: false })
    endTime?: string;

    @ApiProperty({ example: 'Sala 201', required: false })
    location?: string;

    @ApiProperty({ example: '507f1f77bcf86cd799439012', required: false })
    courseId?: string;

    @ApiProperty({ example: true })
    isAllDay: boolean;

    @ApiProperty({ example: 'PROGRAMADO' })
    status: string;

    @ApiProperty({ example: 'director@colegio.cl' })
    organizerEmail: string;

    @ApiProperty({ example: ['profesor1@colegio.cl', 'profesor2@colegio.cl'] })
    attendees: string[];

    @ApiProperty({ example: 1, description: 'Duración en días' })
    durationInDays: number;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({ example: false })
    isPast: boolean;

    @ApiProperty({ example: true })
    isFuture: boolean;

    @ApiProperty({ example: false })
    isOngoing: boolean;

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
    entity: CalendarEventEntity,
): CalendarEventOutput {
    return {
        id: entity.id,
        title: entity.title,
        description: entity.description,
        eventType: entity.eventType,
        startDate: entity.startDate.toISOString().split('T')[0],
        endDate: entity.endDate.toISOString().split('T')[0],
        startTime: entity.startTime,
        endTime: entity.endTime,
        location: entity.location,
        courseId: entity.courseId,
        isAllDay: entity.isAllDay,
        status: entity.status,
        organizerEmail: entity.organizerEmail,
        attendees: entity.attendees,
        durationInDays: entity.durationInDays,
        isActive: entity.isActive,
        isPast: entity.isPast,
        isFuture: entity.isFuture,
        isOngoing: entity.isOngoing,
        createdAt: entity.createdAt.toISOString(),
        createdBy: entity.createdBy,
        updatedAt: entity.updatedAt?.toISOString(),
        updatedBy: entity.updatedBy,
    };
}
