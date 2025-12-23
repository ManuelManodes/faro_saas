import { StudentEntity } from './entity/student.entity';

export const STUDENT_REPOSITORY = Symbol('STUDENT_REPOSITORY');

export interface StudentRepositoryPort {
    save(entity: StudentEntity): Promise<StudentEntity>;
    findById(id: string): Promise<StudentEntity | null>;
    findByRut(rut: string): Promise<StudentEntity | null>;
    findByEmail(email: string): Promise<StudentEntity | null>;
    findAll(filters?: {
        status?: string;
        grade?: string;
        section?: string;
    }): Promise<StudentEntity[]>;
    update(
        id: string,
        entity: Partial<StudentEntity>,
    ): Promise<StudentEntity | null>;
    remove(id: string, removedBy: string): Promise<StudentEntity | null>;
}
