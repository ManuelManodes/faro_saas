import { Inject, Injectable } from '@nestjs/common';
import {
    COURSE_REPOSITORY,
} from '../../../domain/course/repository.port';
import type { CourseRepositoryPort } from '../../../domain/course/repository.port';
import { CourseOutput, mapEntityToOutput } from '../dto/course.output';
import {
    NotFoundError,
    Exceptions,
} from '../../../domain/course/exceptions';

@Injectable()
export class GetCourseUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: CourseRepositoryPort,
    ) { }

    async execute(id: string): Promise<CourseOutput> {
        const course = await this.courseRepository.findById(id);

        if (!course) {
            throw new NotFoundError(
                Exceptions.COURSE_NOT_FOUND.description.replace('${0}', id),
                Exceptions.COURSE_NOT_FOUND.code,
                { id },
            );
        }

        return mapEntityToOutput(course);
    }
}
