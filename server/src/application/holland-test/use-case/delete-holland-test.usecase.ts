import { Inject, Injectable } from '@nestjs/common';
import {
    HOLLAND_TEST_REPOSITORY,
} from '../../../domain/holland-test/repository.port';
import type { HollandTestRepositoryPort } from '../../../domain/holland-test/repository.port';
import {
    NotFoundError,
    PersistenceError,
    Exceptions,
} from '../../../domain/holland-test/exceptions';

@Injectable()
export class DeleteHollandTestUseCase {
    constructor(
        @Inject(HOLLAND_TEST_REPOSITORY)
        private readonly hollandTestRepository: HollandTestRepositoryPort,
    ) { }

    async execute(id: string): Promise<void> {
        const existing = await this.hollandTestRepository.findById(id);

        if (!existing) {
            throw new NotFoundError(
                Exceptions.HOLLAND_TEST_NOT_FOUND.description.replace('${0}', id),
                Exceptions.HOLLAND_TEST_NOT_FOUND.code,
                { id },
            );
        }

        const deleted = await this.hollandTestRepository.delete(id);

        if (!deleted) {
            throw new PersistenceError(
                Exceptions.HOLLAND_TEST_NOT_DELETED.description,
                Exceptions.HOLLAND_TEST_NOT_DELETED.code,
            );
        }
    }
}
