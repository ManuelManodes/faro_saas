import { Inject, Injectable } from '@nestjs/common';
import {
    CALENDAR_EVENT_REPOSITORY,
} from '../../../domain/calendar-event/repository.port';
import type { CalendarEventRepositoryPort } from '../../../domain/calendar-event/repository.port';
import {
    CalendarEventOutput,
    mapEntityToOutput,
} from '../dto/calendar-event.output';

@Injectable()
export class ListCalendarEventUseCase {
    constructor(
        @Inject(CALENDAR_EVENT_REPOSITORY)
        private readonly calendarEventRepository: CalendarEventRepositoryPort,
    ) { }

    async execute(filters?: {
        eventType?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
        courseId?: string;
        organizerEmail?: string;
    }): Promise<CalendarEventOutput[]> {
        const repoFilters: any = {};

        if (filters?.eventType) repoFilters.eventType = filters.eventType;
        if (filters?.status) repoFilters.status = filters.status;
        if (filters?.courseId) repoFilters.courseId = filters.courseId;
        if (filters?.organizerEmail)
            repoFilters.organizerEmail = filters.organizerEmail;
        if (filters?.startDate)
            repoFilters.startDate = new Date(filters.startDate);
        if (filters?.endDate) repoFilters.endDate = new Date(filters.endDate);

        const events = await this.calendarEventRepository.findAll(repoFilters);
        return events.map(mapEntityToOutput);
    }
}
