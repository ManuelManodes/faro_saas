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
export class GetHollandTestUseCase {
    constructor(
        @Inject(HOLLAND_TEST_REPOSITORY)
        private readonly hollandTestRepository: HollandTestRepositoryPort,
    ) { }

    async execute(id: string): Promise<HollandTestOutput> {
        const test = await this.hollandTestRepository.findById(id);

        if (!test) {
            throw new NotFoundError(
                Exceptions.HOLLAND_TEST_NOT_FOUND.description.replace('${0}', id),
                Exceptions.HOLLAND_TEST_NOT_FOUND.code,
                { id },
            );
        }

        return mapEntityToOutput(test);
    }
}
