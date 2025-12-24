import { AttendanceEntity } from './entity/attendance.entity';

export const ATTENDANCE_REPOSITORY = Symbol('ATTENDANCE_REPOSITORY');

export interface AttendanceRepositoryPort {
    save(entity: AttendanceEntity): Promise<AttendanceEntity>;
    findById(id: string): Promise<AttendanceEntity | null>;
    findByStudentAndCourseAndDate(
        studentId: string,
        courseId: string,
        date: Date,
    ): Promise<AttendanceEntity | null>;
    findAll(filters?: {
        studentId?: string;
        courseId?: string;
        dateFrom?: Date;
        dateTo?: Date;
        status?: string;
    }): Promise<AttendanceEntity[]>;
    update(
        id: string,
        partialEntity: Partial<AttendanceEntity>,
    ): Promise<AttendanceEntity | null>;
    delete(id: string): Promise<boolean>;

    // Summary methods
    getStudentSummary(studentId: string, filters?: {
        dateFrom?: Date;
        dateTo?: Date;
    }): Promise<{
        total: number;
        presente: number;
        ausente: number;
        tarde: number;
        justificado: number;
        attendanceRate: number;
    }>;

    getCourseSummary(courseId: string, filters?: {
        date?: Date;
        dateFrom?: Date;
        dateTo?: Date;
    }): Promise<{
        total: number;
        presente: number;
        ausente: number;
        tarde: number;
        justificado: number;
        attendanceRate: number;
    }>;
}
