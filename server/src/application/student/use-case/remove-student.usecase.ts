import { Injectable, Inject } from '@nestjs/common';
import { STUDENT_REPOSITORY } from '../../../domain/student/repository.port';
import type { StudentRepositoryPort } from '../../../domain/student/repository.port';
import { StudentOutput, mapEntityToOutput } from '../dto/student.output';
import {
    NotFoundError,
    ValidationError,
    Exceptions,
} from '../../../domain/student/exceptions';

@Injectable()
export class RemoveStudentUseCase {
    constructor(
        @Inject(STUDENT_REPOSITORY)
        private readonly repository: StudentRepositoryPort,
    ) { }

    async execute(id: string, removedBy: string): Promise<StudentOutput> {
        // Get existing student
        const existing = await this.repository.findById(id);

        if (!existing) {
            throw new NotFoundError(
                Exceptions.STUDENT_NOT_FOUND.description.replace('${0}', id),
                Exceptions.STUDENT_NOT_FOUND.code,
                { id },
            );
        }

        // Check if already removed
        if (existing.status === 'RETIRADO') {
            throw new ValidationError(Exceptions.STUDENT_ALREADY_INACTIVE.description);
        }

        // Soft delete (change status to RETIRADO)
        const removed = await this.repository.remove(id, removedBy);

        if (!removed) {
            throw new NotFoundError(
                Exceptions.STUDENT_NOT_FOUND.description.replace('${0}', id),
                Exceptions.STUDENT_NOT_FOUND.code,
                { id },
            );
        }

        return mapEntityToOutput(removed);
    }
}
