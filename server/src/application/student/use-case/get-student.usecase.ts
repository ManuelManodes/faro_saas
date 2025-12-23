import { Injectable, Inject } from '@nestjs/common';
import { STUDENT_REPOSITORY } from '../../../domain/student/repository.port';
import type { StudentRepositoryPort } from '../../../domain/student/repository.port';
import { StudentOutput, mapEntityToOutput } from '../dto/student.output';
import { NotFoundError, Exceptions } from '../../../domain/student/exceptions';

@Injectable()
export class GetStudentUseCase {
    constructor(
        @Inject(STUDENT_REPOSITORY)
        private readonly repository: StudentRepositoryPort,
    ) { }

    async execute(id: string): Promise<StudentOutput> {
        const entity = await this.repository.findById(id);

        if (!entity) {
            throw new NotFoundError(
                Exceptions.STUDENT_NOT_FOUND.description.replace('${0}', id),
                Exceptions.STUDENT_NOT_FOUND.code,
                { id },
            );
        }

        return mapEntityToOutput(entity);
    }
}
