import { HollandTestEntity } from './entity/holland-test.entity';

export const HOLLAND_TEST_REPOSITORY = Symbol('HOLLAND_TEST_REPOSITORY');

export interface HollandTestRepositoryPort {
    save(entity: HollandTestEntity): Promise<HollandTestEntity>;
    findById(id: string): Promise<HollandTestEntity | null>;
    findByStudentId(studentId: string): Promise<HollandTestEntity[]>;
    findLatestByStudentId(studentId: string): Promise<HollandTestEntity | null>;
    findAll(filters?: {
        studentId?: string;
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        dominantType?: string;
    }): Promise<HollandTestEntity[]>;
    update(
        id: string,
        partialEntity: Partial<HollandTestEntity>,
    ): Promise<HollandTestEntity | null>;
    delete(id: string): Promise<boolean>;
}
