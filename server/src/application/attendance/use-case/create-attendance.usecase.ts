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
import { CreateAttendanceInput } from '../dto/create-attendance.input';
import { AttendanceOutput, mapEntityToOutput } from '../dto/attendance.output';
import {
    DuplicateError,
    BusinessRuleError,
    Exceptions,
} from '../../../domain/attendance/exceptions';

@Injectable()
export class CreateAttendanceUseCase {
    constructor(
        @Inject(ATTENDANCE_REPOSITORY)
        private readonly attendanceRepository: AttendanceRepositoryPort,
        @Inject(STUDENT_REPOSITORY)
        private readonly studentRepository: StudentRepositoryPort,
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: CourseRepositoryPort,
    ) { }

    async execute(
        input: CreateAttendanceInput,
        createdBy: string,
    ): Promise<AttendanceOutput> {
        // Verify student exists
        const student = await this.studentRepository.findById(input.studentId);
        if (!student) {
            throw new BusinessRuleError(
                Exceptions.STUDENT_NOT_EXISTS.description.replace('${0}', input.studentId),
                Exceptions.STUDENT_NOT_EXISTS.code,
                { studentId: input.studentId },
            );
        }

        // Verify course exists
        const course = await this.courseRepository.findById(input.courseId);
        if (!course) {
            throw new BusinessRuleError(
                Exceptions.COURSE_NOT_EXISTS.description.replace('${0}', input.courseId),
                Exceptions.COURSE_NOT_EXISTS.code,
                { courseId: input.courseId },
            );
        }

        // Check for duplicate
        const date = new Date(input.date);
        const existing = await this.attendanceRepository.findByStudentAndCourseAndDate(
            input.studentId,
            input.courseId,
            date,
        );

        if (existing) {
            throw new DuplicateError(
                Exceptions.ATTENDANCE_DUPLICATE.description,
                Exceptions.ATTENDANCE_DUPLICATE.code,
                {
                    studentId: input.studentId,
                    courseId: input.courseId,
                    date: input.date,
                },
            );
        }

        const now = new Date();
        const entity = new AttendanceEntity(
            randomUUID(),
            input.studentId,
            input.courseId,
            date,
            input.status as any,
            input.arrivalTime,
            input.notes,
            input.justificationDocument,
            createdBy, // recordedBy
            now,
            createdBy,
            now,
            createdBy,
        );

        const saved = await this.attendanceRepository.save(entity);
        return mapEntityToOutput(saved);
    }
}
