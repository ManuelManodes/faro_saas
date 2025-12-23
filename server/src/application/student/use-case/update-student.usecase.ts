import { Injectable, Inject } from '@nestjs/common';
import { STUDENT_REPOSITORY } from '../../../domain/student/repository.port';
import type { StudentRepositoryPort } from '../../../domain/student/repository.port';
import { UpdateStudentInput } from '../dto/update-student.input';
import { StudentOutput, mapEntityToOutput } from '../dto/student.output';
import {
    NotFoundError,
    ValidationError,
    Exceptions,
} from '../../../domain/student/exceptions';

@Injectable()
export class UpdateStudentUseCase {
    constructor(
        @Inject(STUDENT_REPOSITORY)
        private readonly repository: StudentRepositoryPort,
    ) { }

    async execute(
        id: string,
        input: UpdateStudentInput,
        updatedBy: string,
    ): Promise<StudentOutput> {
        // Get existing student
        const existing = await this.repository.findById(id);

        if (!existing) {
            throw new NotFoundError(
                Exceptions.STUDENT_NOT_FOUND.description.replace('${0}', id),
                Exceptions.STUDENT_NOT_FOUND.code,
                { id },
            );
        }

        // Validate not updating a removed student
        if (existing.status === 'RETIRADO') {
            throw new ValidationError(Exceptions.CANNOT_UPDATE_REMOVED.description);
        }

        // Prepare update object
        const updateData: any = {
            ...input,
            updatedAt: new Date(),
            updatedBy,
        };

        // Convert date strings to Date objects if present
        if (input.birthDate) {
            updateData.birthDate = new Date(input.birthDate);
        }
        if (input.enrollmentDate) {
            updateData.enrollmentDate = new Date(input.enrollmentDate);
        }

        // Update entity
        const updated = await this.repository.update(id, updateData);

        if (!updated) {
            throw new NotFoundError(
                Exceptions.STUDENT_NOT_FOUND.description.replace('${0}', id),
                Exceptions.STUDENT_NOT_FOUND.code,
                { id },
            );
        }

        return mapEntityToOutput(updated);
    }
}
