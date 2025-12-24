import { Inject, Injectable } from '@nestjs/common';
import {
    ATTENDANCE_REPOSITORY,
} from '../../../domain/attendance/repository.port';
import type { AttendanceRepositoryPort } from '../../../domain/attendance/repository.port';
import { AttendanceOutput, mapEntityToOutput } from '../dto/attendance.output';

@Injectable()
export class ListAttendanceUseCase {
    constructor(
        @Inject(ATTENDANCE_REPOSITORY)
        private readonly attendanceRepository: AttendanceRepositoryPort,
    ) { }

    async execute(filters?: {
        studentId?: string;
        courseId?: string;
        dateFrom?: string;
        dateTo?: string;
        status?: string;
    }): Promise<AttendanceOutput[]> {
        const repoFilters: any = {};

        if (filters?.studentId) repoFilters.studentId = filters.studentId;
        if (filters?.courseId) repoFilters.courseId = filters.courseId;
        if (filters?.status) repoFilters.status = filters.status;
        if (filters?.dateFrom) repoFilters.dateFrom = new Date(filters.dateFrom);
        if (filters?.dateTo) repoFilters.dateTo = new Date(filters.dateTo);

        const attendances = await this.attendanceRepository.findAll(repoFilters);
        return attendances.map(mapEntityToOutput);
    }
}
