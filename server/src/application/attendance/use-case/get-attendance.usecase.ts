import { Inject, Injectable } from '@nestjs/common';
import {
    ATTENDANCE_REPOSITORY,
} from '../../../domain/attendance/repository.port';
import type { AttendanceRepositoryPort } from '../../../domain/attendance/repository.port';
import { AttendanceOutput, mapEntityToOutput } from '../dto/attendance.output';
import {
    NotFoundError,
    Exceptions,
} from '../../../domain/attendance/exceptions';

@Injectable()
export class GetAttendanceUseCase {
    constructor(
        @Inject(ATTENDANCE_REPOSITORY)
        private readonly attendanceRepository: AttendanceRepositoryPort,
    ) { }

    async execute(id: string): Promise<AttendanceOutput> {
        const attendance = await this.attendanceRepository.findById(id);

        if (!attendance) {
            throw new NotFoundError(
                Exceptions.ATTENDANCE_NOT_FOUND.description.replace('${0}', id),
                Exceptions.ATTENDANCE_NOT_FOUND.code,
                { id },
            );
        }

        return mapEntityToOutput(attendance);
    }
}
