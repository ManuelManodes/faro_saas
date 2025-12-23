import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentDocument } from './student.schema';
import { StudentEntity } from '../../../../domain/student/entity/student.entity';
import { StudentRepositoryPort } from '../../../../domain/student/repository.port';
import {
    PersistenceError,
    Exceptions,
} from '../../../../domain/student/exceptions';

@Injectable()
export class StudentMongoRepository implements StudentRepositoryPort {
    constructor(
        @InjectModel('Student')
        private readonly studentModel: Model<StudentDocument>,
    ) { }

    async save(entity: StudentEntity): Promise<StudentEntity> {
        try {
            const doc = new this.studentModel({
                rut: entity.rut,
                firstName: entity.firstName,
                lastName: entity.lastName,
                email: entity.email,
                phone: entity.phone,
                birthDate: entity.birthDate,
                grade: entity.grade,
                section: entity.section,
                address: entity.address,
                emergencyContact: entity.emergencyContact,
                status: entity.status,
                enrollmentDate: entity.enrollmentDate,
                createdAt: entity.createdAt,
                createdBy: entity.createdBy,
                updatedAt: entity.updatedAt,
                updatedBy: entity.updatedBy,
            });

            const saved = await doc.save();

            return this.mapDocumentToEntity(saved);
        } catch (error) {
            throw new PersistenceError(
                Exceptions.STUDENT_NOT_CREATED.description,
                Exceptions.STUDENT_NOT_CREATED.code,
                error as Error,
            );
        }
    }

    async findById(id: string): Promise<StudentEntity | null> {
        try {
            const doc = await this.studentModel.findById(id).exec();

            if (!doc) {
                return null;
            }

            return this.mapDocumentToEntity(doc);
        } catch (error) {
            // Invalid ObjectId format returns null instead of error
            if ((error as any).name === 'CastError') {
                return null;
            }
            throw new PersistenceError(
                Exceptions.STUDENT_NOT_FOUND.description.replace('${0}', id),
                Exceptions.STUDENT_NOT_FOUND.code,
                error as Error,
            );
        }
    }

    async findByRut(rut: string): Promise<StudentEntity | null> {
        try {
            const doc = await this.studentModel.findOne({ rut }).exec();

            if (!doc) {
                return null;
            }

            return this.mapDocumentToEntity(doc);
        } catch (error) {
            throw new PersistenceError(
                'Error al buscar estudiante por RUT',
                Exceptions.STUDENT_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    async findByEmail(email: string): Promise<StudentEntity | null> {
        try {
            const doc = await this.studentModel.findOne({ email }).exec();

            if (!doc) {
                return null;
            }

            return this.mapDocumentToEntity(doc);
        } catch (error) {
            throw new PersistenceError(
                'Error al buscar estudiante por email',
                Exceptions.STUDENT_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    async findAll(filters?: {
        status?: string;
        grade?: string;
        section?: string;
    }): Promise<StudentEntity[]> {
        try {
            const query: any = {};

            // Default: only return ACTIVO students unless specified
            if (filters?.status) {
                query.status = filters.status;
            } else {
                query.status = 'ACTIVO';
            }

            if (filters?.grade) {
                query.grade = filters.grade;
            }

            if (filters?.section) {
                query.section = filters.section;
            }

            const docs = await this.studentModel.find(query).exec();

            return docs.map((doc) => this.mapDocumentToEntity(doc));
        } catch (error) {
            throw new PersistenceError(
                Exceptions.STUDENT_LIST_ERROR.description,
                Exceptions.STUDENT_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    async update(
        id: string,
        partialEntity: Partial<StudentEntity>,
    ): Promise<StudentEntity | null> {
        try {
            const updateDoc: any = {};

            // Only include fields that are present
            if (partialEntity.firstName !== undefined)
                updateDoc.firstName = partialEntity.firstName;
            if (partialEntity.lastName !== undefined)
                updateDoc.lastName = partialEntity.lastName;
            if (partialEntity.email !== undefined)
                updateDoc.email = partialEntity.email;
            if (partialEntity.phone !== undefined)
                updateDoc.phone = partialEntity.phone;
            if (partialEntity.birthDate !== undefined)
                updateDoc.birthDate = partialEntity.birthDate;
            if (partialEntity.grade !== undefined)
                updateDoc.grade = partialEntity.grade;
            if (partialEntity.section !== undefined)
                updateDoc.section = partialEntity.section;
            if (partialEntity.address !== undefined)
                updateDoc.address = partialEntity.address;
            if (partialEntity.emergencyContact !== undefined)
                updateDoc.emergencyContact = partialEntity.emergencyContact;
            if (partialEntity.enrollmentDate !== undefined)
                updateDoc.enrollmentDate = partialEntity.enrollmentDate;
            if (partialEntity.updatedAt !== undefined)
                updateDoc.updatedAt = partialEntity.updatedAt;
            if (partialEntity.updatedBy !== undefined)
                updateDoc.updatedBy = partialEntity.updatedBy;

            const doc = await this.studentModel
                .findByIdAndUpdate(id, { $set: updateDoc }, { new: true })
                .exec();

            if (!doc) {
                return null;
            }

            return this.mapDocumentToEntity(doc);
        } catch (error) {
            if ((error as any).name === 'CastError') {
                return null;
            }
            throw new PersistenceError(
                Exceptions.STUDENT_NOT_UPDATED.description,
                Exceptions.STUDENT_NOT_UPDATED.code,
                error as Error,
            );
        }
    }

    async remove(id: string, removedBy: string): Promise<StudentEntity | null> {
        try {
            const doc = await this.studentModel
                .findByIdAndUpdate(
                    id,
                    {
                        $set: {
                            status: 'RETIRADO',
                            updatedAt: new Date(),
                            updatedBy: removedBy,
                        },
                    },
                    { new: true },
                )
                .exec();

            if (!doc) {
                return null;
            }

            return this.mapDocumentToEntity(doc);
        } catch (error) {
            if ((error as any).name === 'CastError') {
                return null;
            }
            throw new PersistenceError(
                Exceptions.STUDENT_NOT_REMOVED.description,
                Exceptions.STUDENT_NOT_REMOVED.code,
                error as Error,
            );
        }
    }

    private mapDocumentToEntity(doc: StudentDocument): StudentEntity {
        return new StudentEntity(
            doc._id.toString(),
            doc.rut,
            doc.firstName,
            doc.lastName,
            doc.email,
            doc.phone,
            doc.birthDate,
            doc.grade,
            doc.section,
            doc.address,
            doc.emergencyContact,
            doc.status as any,
            doc.enrollmentDate,
            doc.createdAt,
            doc.createdBy,
            doc.updatedAt,
            doc.updatedBy,
        );
    }
}
