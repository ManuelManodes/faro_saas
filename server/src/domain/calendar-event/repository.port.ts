import { CalendarEventEntity } from './entity/calendar-event.entity';

export const CALENDAR_EVENT_REPOSITORY = Symbol('CALENDAR_EVENT_REPOSITORY');

export interface CalendarEventRepositoryPort {
    save(entity: CalendarEventEntity): Promise<CalendarEventEntity>;
    findById(id: string): Promise<CalendarEventEntity | null>;
    findAll(filters?: {
        eventType?: string;
        status?: string;
        startDate?: Date;
        endDate?: Date;
        courseId?: string;
        organizerEmail?: string;
    }): Promise<CalendarEventEntity[]>;
    findByDateRange(
        startDate: Date,
        endDate: Date,
    ): Promise<CalendarEventEntity[]>;
    findUpcomingEvents(
        limit?: number,
    ): Promise<CalendarEventEntity[]>;
    update(
        id: string,
        partialEntity: Partial<CalendarEventEntity>,
    ): Promise<CalendarEventEntity | null>;
    delete(id: string): Promise<boolean>;
}
