import { Inject, Injectable } from '@nestjs/common';
import {
    HOLLAND_TEST_REPOSITORY,
} from '../../../domain/holland-test/repository.port';
import type { HollandTestRepositoryPort } from '../../../domain/holland-test/repository.port';
import { UpdateHollandTestInput } from '../dto/update-holland-test.input';
import { HollandTestOutput, mapEntityToOutput } from '../dto/holland-test.output';
import {
    NotFoundError,
    Exceptions,
} from '../../../domain/holland-test/exceptions';

@Injectable()
export class UpdateHollandTestUseCase {
    constructor(
        @Inject(HOLLAND_TEST_REPOSITORY)
        private readonly hollandTestRepository: HollandTestRepositoryPort,
    ) { }

    async execute(
        id: string,
        input: UpdateHollandTestInput,
        updatedBy: string,
    ): Promise<HollandTestOutput> {
        const existing = await this.hollandTestRepository.findById(id);

        if (!existing) {
            throw new NotFoundError(
                Exceptions.HOLLAND_TEST_NOT_FOUND.description.replace('${0}', id),
                Exceptions.HOLLAND_TEST_NOT_FOUND.code,
                { id },
            );
        }

        const updated = await this.hollandTestRepository.update(id, {
            ...input,
            status: input.status as any,
            updatedAt: new Date(),
            updatedBy,
        });

        if (!updated) {
            throw new NotFoundError(
                Exceptions.HOLLAND_TEST_NOT_FOUND.description.replace('${0}', id),
                Exceptions.HOLLAND_TEST_NOT_FOUND.code,
                { id },
            );
        }

        return mapEntityToOutput(updated);
    }
}
