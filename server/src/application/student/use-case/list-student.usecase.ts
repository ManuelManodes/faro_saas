import { Injectable, Inject } from '@nestjs/common';
import { STUDENT_REPOSITORY } from '../../../domain/student/repository.port';
import type { StudentRepositoryPort } from '../../../domain/student/repository.port';
import { StudentOutput, mapEntityToOutput } from '../dto/student.output';

@Injectable()
export class ListStudentUseCase {
    constructor(
        @Inject(STUDENT_REPOSITORY)
        private readonly repository: StudentRepositoryPort,
    ) { }

    async execute(filters?: {
        status?: string;
        grade?: string;
        section?: string;
    }): Promise<StudentOutput[]> {
        const entities = await this.repository.findAll(filters);
        return entities.map(mapEntityToOutput);
    }
}
