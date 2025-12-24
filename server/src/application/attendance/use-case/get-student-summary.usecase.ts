import { Inject, Injectable } from '@nestjs/common';
import {
    ATTENDANCE_REPOSITORY,
} from '../../../domain/attendance/repository.port';
import type { AttendanceRepositoryPort } from '../../../domain/attendance/repository.port';
import { AttendanceSummaryOutput } from '../dto/attendance.output';

@Injectable()
export class GetStudentSummaryUseCase {
    constructor(
        @Inject(ATTENDANCE_REPOSITORY)
        private readonly attendanceRepository: AttendanceRepositoryPort,
    ) { }

    async execute(
        studentId: string,
        filters?: {
            dateFrom?: string;
            dateTo?: string;
        },
    ): Promise<AttendanceSummaryOutput> {
        const repoFilters: any = {};

        if (filters?.dateFrom) repoFilters.dateFrom = new Date(filters.dateFrom);
        if (filters?.dateTo) repoFilters.dateTo = new Date(filters.dateTo);

        return this.attendanceRepository.getStudentSummary(studentId, repoFilters);
    }
}
