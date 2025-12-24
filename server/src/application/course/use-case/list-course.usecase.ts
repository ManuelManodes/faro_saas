import { Inject, Injectable } from '@nestjs/common';
import {
    COURSE_REPOSITORY,
} from '../../../domain/course/repository.port';
import type { CourseRepositoryPort } from '../../../domain/course/repository.port';
import { CourseOutput, mapEntityToOutput } from '../dto/course.output';

@Injectable()
export class ListCourseUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: CourseRepositoryPort,
    ) { }

    async execute(filters?: {
        grade?: string;
        section?: string;
        subject?: string;
        teacherEmail?: string;
        academicYear?: number;
        status?: string;
    }): Promise<CourseOutput[]> {
        const courses = await this.courseRepository.findAll(filters);
        return courses.map(mapEntityToOutput);
    }
}
