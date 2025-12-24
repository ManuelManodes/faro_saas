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
export class GetUpcomingEventsUseCase {
    constructor(
        @Inject(CALENDAR_EVENT_REPOSITORY)
        private readonly calendarEventRepository: CalendarEventRepositoryPort,
    ) { }

    async execute(limit: number = 10): Promise<CalendarEventOutput[]> {
        const events = await this.calendarEventRepository.findUpcomingEvents(
            limit,
        );
        return events.map(mapEntityToOutput);
    }
}
