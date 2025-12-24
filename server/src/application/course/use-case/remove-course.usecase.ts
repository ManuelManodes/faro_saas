import { Inject, Injectable } from '@nestjs/common';
import {
    COURSE_REPOSITORY,
} from '../../../domain/course/repository.port';
import type { CourseRepositoryPort } from '../../../domain/course/repository.port';
import { CourseOutput, mapEntityToOutput } from '../dto/course.output';
import {
    NotFoundError,
    ValidationError,
    Exceptions,
} from '../../../domain/course/exceptions';

@Injectable()
export class RemoveCourseUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: CourseRepositoryPort,
    ) { }

    async execute(id: string, removedBy: string): Promise<CourseOutput> {
        const existing = await this.courseRepository.findById(id);

        if (!existing) {
            throw new NotFoundError(
                Exceptions.COURSE_NOT_FOUND.description.replace('${0}', id),
                Exceptions.COURSE_NOT_FOUND.code,
                { id },
            );
        }

        // Cannot remove if already finalized
        if (existing.status === 'FINALIZADO') {
            throw new ValidationError('El curso ya está finalizado');
        }

        const removed = await this.courseRepository.remove(id, removedBy);

        if (!removed) {
            throw new NotFoundError(
                Exceptions.COURSE_NOT_FOUND.description.replace('${0}', id),
                Exceptions.COURSE_NOT_FOUND.code,
                { id },
            );
        }

        return mapEntityToOutput(removed);
    }
}
