import { Inject, Injectable } from '@nestjs/common';
import {
    CALENDAR_EVENT_REPOSITORY,
} from '../../../domain/calendar-event/repository.port';
import type { CalendarEventRepositoryPort } from '../../../domain/calendar-event/repository.port';
import {
    CalendarEventOutput,
    mapEntityToOutput,
} from '../dto/calendar-event.output';
import {
    NotFoundError,
    Exceptions,
} from '../../../domain/calendar-event/exceptions';

@Injectable()
export class GetCalendarEventUseCase {
    constructor(
        @Inject(CALENDAR_EVENT_REPOSITORY)
        private readonly calendarEventRepository: CalendarEventRepositoryPort,
    ) { }

    async execute(id: string): Promise<CalendarEventOutput> {
        const event = await this.calendarEventRepository.findById(id);

        if (!event) {
            throw new NotFoundError(
                Exceptions.EVENT_NOT_FOUND.description.replace('${0}', id),
                Exceptions.EVENT_NOT_FOUND.code,
                { id },
            );
        }

        return mapEntityToOutput(event);
    }
}
