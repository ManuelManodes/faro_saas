import { Module } from '@nestjs/common';
import { CalendarEventController } from './calendar-event.controller';
import { CalendarEventMongoModule } from '../../../infrastructure/persistence/mongodb/calendar-event/calendar-event.mongo.module';
import { CreateCalendarEventUseCase } from '../../../application/calendar-event/use-case/create-calendar-event.usecase';
import { ListCalendarEventUseCase } from '../../../application/calendar-event/use-case/list-calendar-event.usecase';
import { GetCalendarEventUseCase } from '../../../application/calendar-event/use-case/get-calendar-event.usecase';
import { GetUpcomingEventsUseCase } from '../../../application/calendar-event/use-case/get-upcoming-events.usecase';
import { UpdateCalendarEventUseCase } from '../../../application/calendar-event/use-case/update-calendar-event.usecase';
import { DeleteCalendarEventUseCase } from '../../../application/calendar-event/use-case/delete-calendar-event.usecase';

@Module({
    imports: [CalendarEventMongoModule],
    controllers: [CalendarEventController],
    providers: [
        CreateCalendarEventUseCase,
        ListCalendarEventUseCase,
        GetCalendarEventUseCase,
        GetUpcomingEventsUseCase,
        UpdateCalendarEventUseCase,
        DeleteCalendarEventUseCase,
    ],
})
export class CalendarEventHttpModule { }
