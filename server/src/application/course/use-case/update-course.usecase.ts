import { Inject, Injectable } from '@nestjs/common';
import {
    COURSE_REPOSITORY,
} from '../../../domain/course/repository.port';
import type { CourseRepositoryPort } from '../../../domain/course/repository.port';
import { UpdateCourseInput } from '../dto/update-course.input';
import { CourseOutput, mapEntityToOutput } from '../dto/course.output';
import {
    NotFoundError,
    ValidationError,
    Exceptions,
} from '../../../domain/course/exceptions';

@Injectable()
export class UpdateCourseUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: CourseRepositoryPort,
    ) { }

    async execute(
        id: string,
        input: UpdateCourseInput,
        updatedBy: string,
    ): Promise<CourseOutput> {
        const existing = await this.courseRepository.findById(id);

        if (!existing) {
            throw new NotFoundError(
                Exceptions.COURSE_NOT_FOUND.description.replace('${0}', id),
                Exceptions.COURSE_NOT_FOUND.code,
                { id },
            );
        }

        // Cannot update finalized courses
        if (existing.status === 'FINALIZADO') {
            throw new ValidationError(
                Exceptions.CANNOT_UPDATE_FINALIZED.description,
            );
        }

        const updated = await this.courseRepository.update(id, {
            ...input,
            updatedAt: new Date(),
            updatedBy,
        });

        if (!updated) {
            throw new NotFoundError(
                Exceptions.COURSE_NOT_FOUND.description.replace('${0}', id),
                Exceptions.COURSE_NOT_FOUND.code,
                { id },
            );
        }

        return mapEntityToOutput(updated);
    }
}
