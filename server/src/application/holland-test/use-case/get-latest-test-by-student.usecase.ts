import { Inject, Injectable } from '@nestjs/common';
import {
    HOLLAND_TEST_REPOSITORY,
} from '../../../domain/holland-test/repository.port';
import type { HollandTestRepositoryPort } from '../../../domain/holland-test/repository.port';
import { HollandTestOutput, mapEntityToOutput } from '../dto/holland-test.output';
import {
    NotFoundError,
    Exceptions,
} from '../../../domain/holland-test/exceptions';

@Injectable()
export class GetLatestTestByStudentUseCase {
    constructor(
        @Inject(HOLLAND_TEST_REPOSITORY)
        private readonly hollandTestRepository: HollandTestRepositoryPort,
    ) { }

    async execute(studentId: string): Promise<HollandTestOutput | null> {
        const test = await this.hollandTestRepository.findLatestByStudentId(
            studentId,
        );

        if (!test) {
            return null;
        }

        return mapEntityToOutput(test);
    }
}
