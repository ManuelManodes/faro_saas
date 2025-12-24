import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
    CALENDAR_EVENT_REPOSITORY,
} from '../../../domain/calendar-event/repository.port';
import type { CalendarEventRepositoryPort } from '../../../domain/calendar-event/repository.port';
import { CalendarEventEntity } from '../../../domain/calendar-event/entity/calendar-event.entity';
import { CreateCalendarEventInput } from '../dto/create-calendar-event.input';
import {
    CalendarEventOutput,
    mapEntityToOutput,
} from '../dto/calendar-event.output';

@Injectable()
export class CreateCalendarEventUseCase {
    constructor(
        @Inject(CALENDAR_EVENT_REPOSITORY)
        private readonly calendarEventRepository: CalendarEventRepositoryPort,
    ) { }

    async execute(
        input: CreateCalendarEventInput,
        createdBy: string,
    ): Promise<CalendarEventOutput> {
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        const now = new Date();

        const entity = new CalendarEventEntity(
            randomUUID(),
            input.title,
            input.description,
            input.eventType as any,
            startDate,
            endDate,
            input.isAllDay,
            input.status as any,
            input.organizerEmail,
            input.attendees || [],
            now,
            createdBy,
            input.startTime,
            input.endTime,
            input.location,
            input.courseId,
            now,
            createdBy,
        );

        const saved = await this.calendarEventRepository.save(entity);
        return mapEntityToOutput(saved);
    }
}
