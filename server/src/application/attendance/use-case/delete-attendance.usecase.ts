import { Inject, Injectable } from '@nestjs/common';
import {
    ATTENDANCE_REPOSITORY,
} from '../../../domain/attendance/repository.port';
import type { AttendanceRepositoryPort } from '../../../domain/attendance/repository.port';
import {
    NotFoundError,
    PersistenceError,
    Exceptions,
} from '../../../domain/attendance/exceptions';

@Injectable()
export class DeleteAttendanceUseCase {
    constructor(
        @Inject(ATTENDANCE_REPOSITORY)
        private readonly attendanceRepository: AttendanceRepositoryPort,
    ) { }

    async execute(id: string): Promise<void> {
        const existing = await this.attendanceRepository.findById(id);

        if (!existing) {
            throw new NotFoundError(
                Exceptions.ATTENDANCE_NOT_FOUND.description.replace('${0}', id),
                Exceptions.ATTENDANCE_NOT_FOUND.code,
                { id },
            );
        }

        const deleted = await this.attendanceRepository.delete(id);

        if (!deleted) {
            throw new PersistenceError(
                Exceptions.ATTENDANCE_NOT_DELETED.description,
                Exceptions.ATTENDANCE_NOT_DELETED.code,
            );
        }
    }
}
