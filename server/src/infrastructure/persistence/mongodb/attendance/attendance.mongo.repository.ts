import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttendanceDocument } from './attendance.schema';
import { AttendanceEntity } from '../../../../domain/attendance/entity/attendance.entity';
import { AttendanceRepositoryPort } from '../../../../domain/attendance/repository.port';
import {
    PersistenceError,
    Exceptions,
} from '../../../../domain/attendance/exceptions';

@Injectable()
export class AttendanceMongoRepository implements AttendanceRepositoryPort {
    constructor(
        @InjectModel('Attendance')
        private readonly attendanceModel: Model<AttendanceDocument>,
    ) { }

    async save(entity: AttendanceEntity): Promise<AttendanceEntity> {
        try {
            const doc = new this.attendanceModel({
                studentId: entity.studentId,
                courseId: entity.courseId,
                date: entity.date,
                status: entity.status,
                arrivalTime: entity.arrivalTime,
                notes: entity.notes,
                justificationDocument: entity.justificationDocument,
                recordedBy: entity.recordedBy,
                createdAt: entity.createdAt,
                createdBy: entity.createdBy,
                updatedAt: entity.updatedAt,
                updatedBy: entity.updatedBy,
            });

            const saved = await doc.save();
            return this.mapDocumentToEntity(saved);
        } catch (error) {
            throw new PersistenceError(
                Exceptions.ATTENDANCE_NOT_CREATED.description,
                Exceptions.ATTENDANCE_NOT_CREATED.code,
                error as Error,
            );
        }
    }

    async findById(id: string): Promise<AttendanceEntity | null> {
        try {
            const doc = await this.attendanceModel.findById(id).exec();
            if (!doc) return null;
            return this.mapDocumentToEntity(doc);
        } catch (error) {
            if ((error as any).name === 'CastError') return null;
            throw new PersistenceError(
                Exceptions.ATTENDANCE_NOT_FOUND.description.replace('${0}', id),
                Exceptions.ATTENDANCE_NOT_FOUND.code,
                error as Error,
            );
        }
    }

    async findByStudentAndCourseAndDate(
        studentId: string,
        courseId: string,
        date: Date,
    ): Promise<AttendanceEntity | null> {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const doc = await this.attendanceModel
                .findOne({
                    studentId,
                    courseId,
                    date: { $gte: startOfDay, $lte: endOfDay },
                })
                .exec();

            if (!doc) return null;
            return this.mapDocumentToEntity(doc);
        } catch (error) {
            throw new PersistenceError(
                'Error al buscar asistencia',
                Exceptions.ATTENDANCE_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    async findAll(filters?: {
        studentId?: string;
        courseId?: string;
        dateFrom?: Date;
        dateTo?: Date;
        status?: string;
    }): Promise<AttendanceEntity[]> {
        try {
            const query: any = {};

            if (filters?.studentId) query.studentId = filters.studentId;
            if (filters?.courseId) query.courseId = filters.courseId;
            if (filters?.status) query.status = filters.status;

            if (filters?.dateFrom || filters?.dateTo) {
                query.date = {};
                if (filters.dateFrom) query.date.$gte = filters.dateFrom;
                if (filters.dateTo) query.date.$lte = filters.dateTo;
            }

            const docs = await this.attendanceModel.find(query).sort({ date: -1 }).exec();
            return docs.map((doc) => this.mapDocumentToEntity(doc));
        } catch (error) {
            throw new PersistenceError(
                Exceptions.ATTENDANCE_LIST_ERROR.description,
                Exceptions.ATTENDANCE_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    async update(
        id: string,
        partialEntity: Partial<AttendanceEntity>,
    ): Promise<AttendanceEntity | null> {
        try {
            const updateDoc: any = {};

            if (partialEntity.studentId !== undefined)
                updateDoc.studentId = partialEntity.studentId;
            if (partialEntity.courseId !== undefined)
                updateDoc.courseId = partialEntity.courseId;
            if (partialEntity.date !== undefined) updateDoc.date = partialEntity.date;
            if (partialEntity.status !== undefined) updateDoc.status = partialEntity.status;
            if (partialEntity.arrivalTime !== undefined)
                updateDoc.arrivalTime = partialEntity.arrivalTime;
            if (partialEntity.notes !== undefined) updateDoc.notes = partialEntity.notes;
            if (partialEntity.justificationDocument !== undefined)
                updateDoc.justificationDocument = partialEntity.justificationDocument;
            if (partialEntity.recordedBy !== undefined)
                updateDoc.recordedBy = partialEntity.recordedBy;
            if (partialEntity.updatedAt !== undefined)
                updateDoc.updatedAt = partialEntity.updatedAt;
            if (partialEntity.updatedBy !== undefined)
                updateDoc.updatedBy = partialEntity.updatedBy;

            const doc = await this.attendanceModel
                .findByIdAndUpdate(id, { $set: updateDoc }, { new: true })
                .exec();

            if (!doc) return null;
            return this.mapDocumentToEntity(doc);
        } catch (error) {
            if ((error as any).name === 'CastError') return null;
            throw new PersistenceError(
                Exceptions.ATTENDANCE_NOT_UPDATED.description,
                Exceptions.ATTENDANCE_NOT_UPDATED.code,
                error as Error,
            );
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await this.attendanceModel.findByIdAndDelete(id).exec();
            return result !== null;
        } catch (error) {
            if ((error as any).name === 'CastError') return false;
            throw new PersistenceError(
                Exceptions.ATTENDANCE_NOT_DELETED.description,
                Exceptions.ATTENDANCE_NOT_DELETED.code,
                error as Error,
            );
        }
    }

    async getStudentSummary(
        studentId: string,
        filters?: { dateFrom?: Date; dateTo?: Date },
    ): Promise<{
        total: number;
        presente: number;
        ausente: number;
        tarde: number;
        justificado: number;
        attendanceRate: number;
    }> {
        try {
            const match: any = { studentId };

            if (filters?.dateFrom || filters?.dateTo) {
                match.date = {};
                if (filters.dateFrom) match.date.$gte = filters.dateFrom;
                if (filters.dateTo) match.date.$lte = filters.dateTo;
            }

            const result = await this.attendanceModel
                .aggregate([
                    { $match: match },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 },
                            presente: {
                                $sum: { $cond: [{ $eq: ['$status', 'PRESENTE'] }, 1, 0] },
                            },
                            ausente: {
                                $sum: { $cond: [{ $eq: ['$status', 'AUSENTE'] }, 1, 0] },
                            },
                            tarde: {
                                $sum: { $cond: [{ $eq: ['$status', 'TARDE'] }, 1, 0] },
                            },
                            justificado: {
                                $sum: { $cond: [{ $eq: ['$status', 'JUSTIFICADO'] }, 1, 0] },
                            },
                        },
                    },
                ])
                .exec();

            if (result.length === 0) {
                return {
                    total: 0,
                    presente: 0,
                    ausente: 0,
                    tarde: 0,
                    justificado: 0,
                    attendanceRate: 0,
                };
            }

            const summary = result[0];
            const presentCount = summary.presente + summary.tarde; // PRESENTE + TARDE = asistió
            const attendanceRate =
                summary.total > 0 ? (presentCount / summary.total) * 100 : 0;

            return {
                total: summary.total,
                presente: summary.presente,
                ausente: summary.ausente,
                tarde: summary.tarde,
                justificado: summary.justificado,
                attendanceRate: Math.round(attendanceRate * 100) / 100,
            };
        } catch (error) {
            throw new PersistenceError(
                'Error al calcular resumen de asistencia del estudiante',
                Exceptions.ATTENDANCE_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    async getCourseSummary(
        courseId: string,
        filters?: { date?: Date; dateFrom?: Date; dateTo?: Date },
    ): Promise<{
        total: number;
        presente: number;
        ausente: number;
        tarde: number;
        justificado: number;
        attendanceRate: number;
    }> {
        try {
            const match: any = { courseId };

            if (filters?.date) {
                const startOfDay = new Date(filters.date);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(filters.date);
                endOfDay.setHours(23, 59, 59, 999);

                match.date = { $gte: startOfDay, $lte: endOfDay };
            } else if (filters?.dateFrom || filters?.dateTo) {
                match.date = {};
                if (filters.dateFrom) match.date.$gte = filters.dateFrom;
                if (filters.dateTo) match.date.$lte = filters.dateTo;
            }

            const result = await this.attendanceModel
                .aggregate([
                    { $match: match },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 },
                            presente: {
                                $sum: { $cond: [{ $eq: ['$status', 'PRESENTE'] }, 1, 0] },
                            },
                            ausente: {
                                $sum: { $cond: [{ $eq: ['$status', 'AUSENTE'] }, 1, 0] },
                            },
                            tarde: {
                                $sum: { $cond: [{ $eq: ['$status', 'TARDE'] }, 1, 0] },
                            },
                            justificado: {
                                $sum: { $cond: [{ $eq: ['$status', 'JUSTIFICADO'] }, 1, 0] },
                            },
                        },
                    },
                ])
                .exec();

            if (result.length === 0) {
                return {
                    total: 0,
                    presente: 0,
                    ausente: 0,
                    tarde: 0,
                    justificado: 0,
                    attendanceRate: 0,
                };
            }

            const summary = result[0];
            const presentCount = summary.presente + summary.tarde;
            const attendanceRate =
                summary.total > 0 ? (presentCount / summary.total) * 100 : 0;

            return {
                total: summary.total,
                presente: summary.presente,
                ausente: summary.ausente,
                tarde: summary.tarde,
                justificado: summary.justificado,
                attendanceRate: Math.round(attendanceRate * 100) / 100,
            };
        } catch (error) {
            throw new PersistenceError(
                'Error al calcular resumen de asistencia del curso',
                Exceptions.ATTENDANCE_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    private mapDocumentToEntity(doc: AttendanceDocument): AttendanceEntity {
        return new AttendanceEntity(
            doc._id.toString(),
            doc.studentId,
            doc.courseId,
            doc.date,
            doc.status as any,
            doc.arrivalTime,
            doc.notes,
            doc.justificationDocument,
            doc.recordedBy,
            doc.createdAt,
            doc.createdBy,
            doc.updatedAt,
            doc.updatedBy,
        );
    }
}
