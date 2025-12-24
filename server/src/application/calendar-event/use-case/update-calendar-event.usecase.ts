import { Inject, Injectable } from '@nestjs/common';
import {
    CALENDAR_EVENT_REPOSITORY,
} from '../../../domain/calendar-event/repository.port';
import type { CalendarEventRepositoryPort } from '../../../domain/calendar-event/repository.port';
import { UpdateCalendarEventInput } from '../dto/update-calendar-event.input';
import {
    CalendarEventOutput,
    mapEntityToOutput,
} from '../dto/calendar-event.output';
import {
    NotFoundError,
    BusinessRuleError,
    Exceptions,
} from '../../../domain/calendar-event/exceptions';

@Injectable()
export class UpdateCalendarEventUseCase {
    constructor(
        @Inject(CALENDAR_EVENT_REPOSITORY)
        private readonly calendarEventRepository: CalendarEventRepositoryPort,
    ) { }

    async execute(
        id: string,
        input: UpdateCalendarEventInput,
        updatedBy: string,
    ): Promise<CalendarEventOutput> {
        const existing = await this.calendarEventRepository.findById(id);

        if (!existing) {
            throw new NotFoundError(
                Exceptions.EVENT_NOT_FOUND.description.replace('${0}', id),
                Exceptions.EVENT_NOT_FOUND.code,
                { id },
            );
        }

        // No permitir actualizar eventos ya completados
        if (existing.status === 'COMPLETADO') {
            throw new BusinessRuleError(
                Exceptions.CANNOT_UPDATE_COMPLETED.description,
                Exceptions.CANNOT_UPDATE_COMPLETED.code,
                { id },
            );
        }

        const updateData: any = {
            ...input,
            updatedAt: new Date(),
            updatedBy,
        };

        // Convert dates if provided
        if (input.startDate) updateData.startDate = new Date(input.startDate);
        if (input.endDate) updateData.endDate = new Date(input.endDate);

        const updated = await this.calendarEventRepository.update(id, updateData);

        if (!updated) {
            throw new NotFoundError(
                Exceptions.EVENT_NOT_FOUND.description.replace('${0}', id),
                Exceptions.EVENT_NOT_FOUND.code,
                { id },
            );
        }

        return mapEntityToOutput(updated);
    }
}
