import { CourseEntity } from './entity/course.entity';

export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');

export interface CourseRepositoryPort {
    save(entity: CourseEntity): Promise<CourseEntity>;
    findById(id: string): Promise<CourseEntity | null>;
    findByCode(code: string): Promise<CourseEntity | null>;
    findAll(filters?: {
        grade?: string;
        section?: string;
        subject?: string;
        teacherEmail?: string;
        academicYear?: number;
        status?: string;
    }): Promise<CourseEntity[]>;
    update(id: string, partialEntity: Partial<CourseEntity>): Promise<CourseEntity | null>;
    remove(id: string, removedBy: string): Promise<CourseEntity | null>;
}
