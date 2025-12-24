import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
    ATTENDANCE_REPOSITORY,
} from '../../../domain/attendance/repository.port';
import type { AttendanceRepositoryPort } from '../../../domain/attendance/repository.port';
import { STUDENT_REPOSITORY } from '../../../domain/student/repository.port';
import type { StudentRepositoryPort } from '../../../domain/student/repository.port';
import { COURSE_REPOSITORY } from '../../../domain/course/repository.port';
import type { CourseRepositoryPort } from '../../../domain/course/repository.port';
import { AttendanceEntity } from '../../../domain/attendance/entity/attendance.entity';
import { BulkAttendanceInput } from '../dto/bulk-attendance.input';
import { AttendanceOutput, mapEntityToOutput } from '../dto/attendance.output';
import {
    BusinessRuleError,
    Exceptions,
} from '../../../domain/attendance/exceptions';

@Injectable()
export class BulkRegisterAttendanceUseCase {
    constructor(
        @Inject(ATTENDANCE_REPOSITORY)
        private readonly attendanceRepository: AttendanceRepositoryPort,
        @Inject(STUDENT_REPOSITORY)
        private readonly studentRepository: StudentRepositoryPort,
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: CourseRepositoryPort,
    ) { }

    async execute(
        input: BulkAttendanceInput,
        createdBy: string,
    ): Promise<AttendanceOutput[]> {
        // Verify course exists
        const course = await this.courseRepository.findById(input.courseId);
        if (!course) {
            throw new BusinessRuleError(
                Exceptions.COURSE_NOT_EXISTS.description.replace('${0}', input.courseId),
                Exceptions.COURSE_NOT_EXISTS.code,
                { courseId: input.courseId },
            );
        }

        const date = new Date(input.date);
        const results: AttendanceOutput[] = [];
        const errors: Array<{ studentId: string; error: string }> = [];

        for (const attendance of input.attendances) {
            try {
                // Verify student exists
                const student = await this.studentRepository.findById(attendance.studentId);
                if (!student) {
                    errors.push({
                        studentId: attendance.studentId,
                        error: 'Estudiante no existe',
                    });
                    continue;
                }

                // Check for duplicate
                const existing = await this.attendanceRepository.findByStudentAndCourseAndDate(
                    attendance.studentId,
                    input.courseId,
                    date,
                );

                if (existing) {
                    errors.push({
                        studentId: attendance.studentId,
                        error: 'Ya existe registro para esta fecha',
                    });
                    continue;
                }

                const now = new Date();
                const entity = new AttendanceEntity(
                    randomUUID(),
                    attendance.studentId,
                    input.courseId,
                    date,
                    attendance.status as any,
                    attendance.arrivalTime,
                    attendance.notes,
                    undefined, // justificationDocument
                    createdBy, // recordedBy
                    now,
                    createdBy,
                    now,
                    createdBy,
                );

                const saved = await this.attendanceRepository.save(entity);
                results.push(mapEntityToOutput(saved));
            } catch (error) {
                errors.push({
                    studentId: attendance.studentId,
                    error: (error as Error).message,
                });
            }
        }

        if (errors.length > 0) {
            console.warn('Bulk attendance errors:', errors);
        }

        return results;
    }
}
