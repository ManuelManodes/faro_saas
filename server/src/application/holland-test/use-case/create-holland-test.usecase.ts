import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
    HOLLAND_TEST_REPOSITORY,
} from '../../../domain/holland-test/repository.port';
import type { HollandTestRepositoryPort } from '../../../domain/holland-test/repository.port';
import { STUDENT_REPOSITORY } from '../../../domain/student/repository.port';
import type { StudentRepositoryPort } from '../../../domain/student/repository.port';
import { HollandTestEntity } from '../../../domain/holland-test/entity/holland-test.entity';
import { CreateHollandTestInput } from '../dto/create-holland-test.input';
import { HollandTestOutput, mapEntityToOutput } from '../dto/holland-test.output';
import {
    BusinessRuleError,
    Exceptions,
} from '../../../domain/holland-test/exceptions';

@Injectable()
export class CreateHollandTestUseCase {
    constructor(
        @Inject(HOLLAND_TEST_REPOSITORY)
        private readonly hollandTestRepository: HollandTestRepositoryPort,
        @Inject(STUDENT_REPOSITORY)
        private readonly studentRepository: StudentRepositoryPort,
    ) { }

    async execute(
        input: CreateHollandTestInput,
        createdBy: string,
    ): Promise<HollandTestOutput> {
        // Verify student exists
        const student = await this.studentRepository.findById(input.studentId);
        if (!student) {
            throw new BusinessRuleError(
                Exceptions.STUDENT_NOT_EXISTS.description.replace(
                    '${0}',
                    input.studentId,
                ),
                Exceptions.STUDENT_NOT_EXISTS.code,
                { studentId: input.studentId },
            );
        }

        const testDate = new Date(input.testDate);
        const now = new Date();

        const entity = new HollandTestEntity(
            randomUUID(),
            input.studentId,
            testDate,
            input.scores,
            input.dominantTypes,
            input.interpretation,
            input.recommendations,
            input.status as any,
            input.administeredBy,
            now,
            createdBy,
            now,
            createdBy,
        );

        const saved = await this.hollandTestRepository.save(entity);
        return mapEntityToOutput(saved);
    }
}
