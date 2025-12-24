import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CalendarEventSchema } from './calendar-event.schema';
import { CALENDAR_EVENT_REPOSITORY } from '../../../../domain/calendar-event/repository.port';
import { CalendarEventMongoRepository } from './calendar-event.mongo.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'CalendarEvent', schema: CalendarEventSchema },
        ]),
    ],
    providers: [
        {
            provide: CALENDAR_EVENT_REPOSITORY,
            useClass: CalendarEventMongoRepository,
        },
    ],
    exports: [CALENDAR_EVENT_REPOSITORY],
})
export class CalendarEventMongoModule { }
