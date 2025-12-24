import { Inject, Injectable } from '@nestjs/common';
import {
    HOLLAND_TEST_REPOSITORY,
} from '../../../domain/holland-test/repository.port';
import type { HollandTestRepositoryPort } from '../../../domain/holland-test/repository.port';
import { HollandTestOutput, mapEntityToOutput } from '../dto/holland-test.output';

@Injectable()
export class ListHollandTestUseCase {
    constructor(
        @Inject(HOLLAND_TEST_REPOSITORY)
        private readonly hollandTestRepository: HollandTestRepositoryPort,
    ) { }

    async execute(filters?: {
        studentId?: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
        dominantType?: string;
    }): Promise<HollandTestOutput[]> {
        const repoFilters: any = {};

        if (filters?.studentId) repoFilters.studentId = filters.studentId;
        if (filters?.status) repoFilters.status = filters.status;
        if (filters?.dominantType) repoFilters.dominantType = filters.dominantType;
        if (filters?.dateFrom) repoFilters.dateFrom = new Date(filters.dateFrom);
        if (filters?.dateTo) repoFilters.dateTo = new Date(filters.dateTo);

        const tests = await this.hollandTestRepository.findAll(repoFilters);
        return tests.map(mapEntityToOutput);
    }
}
