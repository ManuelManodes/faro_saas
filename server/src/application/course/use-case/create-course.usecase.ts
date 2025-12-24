import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
    COURSE_REPOSITORY,
} from '../../../domain/course/repository.port';
import type { CourseRepositoryPort } from '../../../domain/course/repository.port';
import { CourseEntity } from '../../../domain/course/entity/course.entity';
import { CreateCourseInput } from '../dto/create-course.input';
import { CourseOutput, mapEntityToOutput } from '../dto/course.output';
import {
    DuplicateError,
    Exceptions,
} from '../../../domain/course/exceptions';

@Injectable()
export class CreateCourseUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: CourseRepositoryPort,
    ) { }

    async execute(
        input: CreateCourseInput,
        createdBy: string,
    ): Promise<CourseOutput> {
        // Check for duplicate code
        const existingCourse = await this.courseRepository.findByCode(input.code);
        if (existingCourse) {
            throw new DuplicateError(
                Exceptions.COURSE_DUPLICATE_CODE.description.replace('${0}', input.code),
                Exceptions.COURSE_DUPLICATE_CODE.code,
                { code: input.code },
            );
        }

        const now = new Date();
        const entity = new CourseEntity(
            randomUUID(),
            input.code,
            input.name,
            input.grade,
            input.section,
            input.subject,
            input.teacherName,
            input.teacherEmail,
            input.schedule,
            input.capacity,
            0, // enrolledCount starts at 0
            input.academicYear,
            input.semester,
            'ACTIVO', // Default status
            now,
            createdBy,
            now,
            createdBy,
        );

        const saved = await this.courseRepository.save(entity);
        return mapEntityToOutput(saved);
    }
}
