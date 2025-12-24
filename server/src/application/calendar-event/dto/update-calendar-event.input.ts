import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCalendarEventInput } from './create-calendar-event.input';

export class UpdateCalendarEventInput extends PartialType(
    CreateCalendarEventInput,
) { }
