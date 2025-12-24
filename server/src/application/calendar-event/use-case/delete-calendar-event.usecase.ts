import { Inject, Injectable } from '@nestjs/common';
import {
    CALENDAR_EVENT_REPOSITORY,
} from '../../../domain/calendar-event/repository.port';
import type { CalendarEventRepositoryPort } from '../../../domain/calendar-event/repository.port';
import {
    NotFoundError,
    PersistenceError,
    Exceptions,
} from '../../../domain/calendar-event/exceptions';

@Injectable()
export class DeleteCalendarEventUseCase {
    constructor(
        @Inject(CALENDAR_EVENT_REPOSITORY)
        private readonly calendarEventRepository: CalendarEventRepositoryPort,
    ) { }

    async execute(id: string): Promise<void> {
        const existing = await this.calendarEventRepository.findById(id);

        if (!existing) {
            throw new NotFoundError(
                Exceptions.EVENT_NOT_FOUND.description.replace('${0}', id),
                Exceptions.EVENT_NOT_FOUND.code,
                { id },
            );
        }

        const deleted = await this.calendarEventRepository.delete(id);

        if (!deleted) {
            throw new PersistenceError(
                Exceptions.EVENT_NOT_DELETED.description,
                Exceptions.EVENT_NOT_DELETED.code,
            );
        }
    }
}
