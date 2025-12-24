import { Inject, Injectable } from '@nestjs/common';
import {
    ATTENDANCE_REPOSITORY,
} from '../../../domain/attendance/repository.port';
import type { AttendanceRepositoryPort } from '../../../domain/attendance/repository.port';
import { AttendanceSummaryOutput } from '../dto/attendance.output';

@Injectable()
export class GetCourseSummaryUseCase {
    constructor(
        @Inject(ATTENDANCE_REPOSITORY)
        private readonly attendanceRepository: AttendanceRepositoryPort,
    ) { }

    async execute(
        courseId: string,
        filters?: {
            date?: string;
            dateFrom?: string;
            dateTo?: string;
        },
    ): Promise<AttendanceSummaryOutput> {
        const repoFilters: any = {};

        if (filters?.date) repoFilters.date = new Date(filters.date);
        if (filters?.dateFrom) repoFilters.dateFrom = new Date(filters.dateFrom);
        if (filters?.dateTo) repoFilters.dateTo = new Date(filters.dateTo);

        return this.attendanceRepository.getCourseSummary(courseId, repoFilters);
    }
}
