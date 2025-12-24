import { Inject, Injectable } from '@nestjs/common';
import {
    ATTENDANCE_REPOSITORY,
} from '../../../domain/attendance/repository.port';
import type { AttendanceRepositoryPort } from '../../../domain/attendance/repository.port';
import { UpdateAttendanceInput } from '../dto/update-attendance.input';
import { AttendanceOutput, mapEntityToOutput } from '../dto/attendance.output';
import {
    NotFoundError,
    Exceptions,
} from '../../../domain/attendance/exceptions';

@Injectable()
export class UpdateAttendanceUseCase {
    constructor(
        @Inject(ATTENDANCE_REPOSITORY)
        private readonly attendanceRepository: AttendanceRepositoryPort,
    ) { }

    async execute(
        id: string,
        input: UpdateAttendanceInput,
        updatedBy: string,
    ): Promise<AttendanceOutput> {
        const existing = await this.attendanceRepository.findById(id);

        if (!existing) {
            throw new NotFoundError(
                Exceptions.ATTENDANCE_NOT_FOUND.description.replace('${0}', id),
                Exceptions.ATTENDANCE_NOT_FOUND.code,
                { id },
            );
        }

        const updateData: any = {
            ...input,
            updatedAt: new Date(),
            updatedBy,
        };

        if (input.date) {
            updateData.date = new Date(input.date);
        }

        const updated = await this.attendanceRepository.update(id, updateData);

        if (!updated) {
            throw new NotFoundError(
                Exceptions.ATTENDANCE_NOT_FOUND.description.replace('${0}', id),
                Exceptions.ATTENDANCE_NOT_FOUND.code,
                { id },
            );
        }

        return mapEntityToOutput(updated);
    }
}
