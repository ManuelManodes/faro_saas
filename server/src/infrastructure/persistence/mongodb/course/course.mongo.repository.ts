import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseDocument } from './course.schema';
import { CourseEntity } from '../../../../domain/course/entity/course.entity';
import { CourseRepositoryPort } from '../../../../domain/course/repository.port';
import {
    PersistenceError,
    Exceptions,
} from '../../../../domain/course/exceptions';

@Injectable()
export class CourseMongoRepository implements CourseRepositoryPort {
    constructor(
        @InjectModel('Course')
        private readonly courseModel: Model<CourseDocument>,
    ) { }

    async save(entity: CourseEntity): Promise<CourseEntity> {
        try {
            const doc = new this.courseModel({
                code: entity.code,
                name: entity.name,
                grade: entity.grade,
                section: entity.section,
                subject: entity.subject,
                teacherName: entity.teacherName,
                teacherEmail: entity.teacherEmail,
                schedule: entity.schedule,
                capacity: entity.capacity,
                enrolledCount: entity.enrolledCount,
                academicYear: entity.academicYear,
                semester: entity.semester,
                status: entity.status,
                createdAt: entity.createdAt,
                createdBy: entity.createdBy,
                updatedAt: entity.updatedAt,
                updatedBy: entity.updatedBy,
            });

            const saved = await doc.save();
            return this.mapDocumentToEntity(saved);
        } catch (error) {
            throw new PersistenceError(
                Exceptions.COURSE_NOT_CREATED.description,
                Exceptions.COURSE_NOT_CREATED.code,
                error as Error,
            );
        }
    }

    async findById(id: string): Promise<CourseEntity | null> {
        try {
            const doc = await this.courseModel.findById(id).exec();
            if (!doc) return null;
            return this.mapDocumentToEntity(doc);
        } catch (error) {
            if ((error as any).name === 'CastError') return null;
            throw new PersistenceError(
                Exceptions.COURSE_NOT_FOUND.description.replace('${0}', id),
                Exceptions.COURSE_NOT_FOUND.code,
                error as Error,
            );
        }
    }

    async findByCode(code: string): Promise<CourseEntity | null> {
        try {
            const doc = await this.courseModel.findOne({ code }).exec();
            if (!doc) return null;
            return this.mapDocumentToEntity(doc);
        } catch (error) {
            throw new PersistenceError(
                'Error al buscar curso por código',
                Exceptions.COURSE_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    async findAll(filters?: {
        grade?: string;
        section?: string;
        subject?: string;
        teacherEmail?: string;
        academicYear?: number;
        status?: string;
    }): Promise<CourseEntity[]> {
        try {
            const query: any = {};

            if (filters?.status) {
                query.status = filters.status;
            } else {
                query.status = 'ACTIVO';
            }

            if (filters?.grade) query.grade = filters.grade;
            if (filters?.section) query.section = filters.section;
            if (filters?.subject) query.subject = filters.subject;
            if (filters?.teacherEmail) query.teacherEmail = filters.teacherEmail;
            if (filters?.academicYear) query.academicYear = filters.academicYear;

            const docs = await this.courseModel.find(query).exec();
            return docs.map((doc) => this.mapDocumentToEntity(doc));
        } catch (error) {
            throw new PersistenceError(
                Exceptions.COURSE_LIST_ERROR.description,
                Exceptions.COURSE_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    async update(
        id: string,
        partialEntity: Partial<CourseEntity>,
    ): Promise<CourseEntity | null> {
        try {
            const updateDoc: any = {};

            if (partialEntity.name !== undefined) updateDoc.name = partialEntity.name;
            if (partialEntity.grade !== undefined) updateDoc.grade = partialEntity.grade;
            if (partialEntity.section !== undefined) updateDoc.section = partialEntity.section;
            if (partialEntity.subject !== undefined) updateDoc.subject = partialEntity.subject;
            if (partialEntity.teacherName !== undefined) updateDoc.teacherName = partialEntity.teacherName;
            if (partialEntity.teacherEmail !== undefined) updateDoc.teacherEmail = partialEntity.teacherEmail;
            if (partialEntity.schedule !== undefined) updateDoc.schedule = partialEntity.schedule;
            if (partialEntity.capacity !== undefined) updateDoc.capacity = partialEntity.capacity;
            if (partialEntity.enrolledCount !== undefined) updateDoc.enrolledCount = partialEntity.enrolledCount;
            if (partialEntity.academicYear !== undefined) updateDoc.academicYear = partialEntity.academicYear;
            if (partialEntity.semester !== undefined) updateDoc.semester = partialEntity.semester;
            if (partialEntity.status !== undefined) updateDoc.status = partialEntity.status;
            if (partialEntity.updatedAt !== undefined) updateDoc.updatedAt = partialEntity.updatedAt;
            if (partialEntity.updatedBy !== undefined) updateDoc.updatedBy = partialEntity.updatedBy;

            const doc = await this.courseModel
                .findByIdAndUpdate(id, { $set: updateDoc }, { new: true })
                .exec();

            if (!doc) return null;
            return this.mapDocumentToEntity(doc);
        } catch (error) {
            if ((error as any).name === 'CastError') return null;
            throw new PersistenceError(
                Exceptions.COURSE_NOT_UPDATED.description,
                Exceptions.COURSE_NOT_UPDATED.code,
                error as Error,
            );
        }
    }

    async remove(id: string, removedBy: string): Promise<CourseEntity | null> {
        try {
            const doc = await this.courseModel
                .findByIdAndUpdate(
                    id,
                    {
                        $set: {
                            status: 'FINALIZADO',
                            updatedAt: new Date(),
                            updatedBy: removedBy,
                        },
                    },
                    { new: true },
                )
                .exec();

            if (!doc) return null;
            return this.mapDocumentToEntity(doc);
        } catch (error) {
            if ((error as any).name === 'CastError') return null;
            throw new PersistenceError(
                Exceptions.COURSE_NOT_REMOVED.description,
                Exceptions.COURSE_NOT_REMOVED.code,
                error as Error,
            );
        }
    }

    private mapDocumentToEntity(doc: CourseDocument): CourseEntity {
        return new CourseEntity(
            doc._id.toString(),
            doc.code,
            doc.name,
            doc.grade,
            doc.section,
            doc.subject,
            doc.teacherName,
            doc.teacherEmail,
            doc.schedule,
            doc.capacity,
            doc.enrolledCount,
            doc.academicYear,
            doc.semester,
            doc.status as any,
            doc.createdAt,
            doc.createdBy,
            doc.updatedAt,
            doc.updatedBy,
        );
    }
}
