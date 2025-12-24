import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HollandTestDocument } from './holland-test.schema';
import { HollandTestEntity } from '../../../../domain/holland-test/entity/holland-test.entity';
import { HollandTestRepositoryPort } from '../../../../domain/holland-test/repository.port';
import {
    PersistenceError,
    Exceptions,
} from '../../../../domain/holland-test/exceptions';

@Injectable()
export class HollandTestMongoRepository implements HollandTestRepositoryPort {
    constructor(
        @InjectModel('HollandTest')
        private readonly hollandTestModel: Model<HollandTestDocument>,
    ) { }

    async save(entity: HollandTestEntity): Promise<HollandTestEntity> {
        try {
            const doc = new this.hollandTestModel({
                studentId: entity.studentId,
                testDate: entity.testDate,
                scores: entity.scores,
                dominantTypes: entity.dominantTypes,
                interpretation: entity.interpretation,
                recommendations: entity.recommendations,
                status: entity.status,
                administeredBy: entity.administeredBy,
                createdAt: entity.createdAt,
                createdBy: entity.createdBy,
                updatedAt: entity.updatedAt,
                updatedBy: entity.updatedBy,
            });

            const saved = await doc.save();
            return this.mapDocumentToEntity(saved);
        } catch (error) {
            throw new PersistenceError(
                Exceptions.HOLLAND_TEST_NOT_CREATED.description,
                Exceptions.HOLLAND_TEST_NOT_CREATED.code,
                error as Error,
            );
        }
    }

    async findById(id: string): Promise<HollandTestEntity | null> {
        try {
            const doc = await this.hollandTestModel.findById(id).exec();
            if (!doc) return null;
            return this.mapDocumentToEntity(doc);
        } catch (error) {
            if ((error as any).name === 'CastError') return null;
            throw new PersistenceError(
                Exceptions.HOLLAND_TEST_NOT_FOUND.description.replace('${0}', id),
                Exceptions.HOLLAND_TEST_NOT_FOUND.code,
                error as Error,
            );
        }
    }

    async findByStudentId(studentId: string): Promise<HollandTestEntity[]> {
        try {
            const docs = await this.hollandTestModel
                .find({ studentId })
                .sort({ testDate: -1 })
                .exec();
            return docs.map((doc) => this.mapDocumentToEntity(doc));
        } catch (error) {
            throw new PersistenceError(
                'Error al buscar tests por estudiante',
                Exceptions.HOLLAND_TEST_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    async findLatestByStudentId(
        studentId: string,
    ): Promise<HollandTestEntity | null> {
        try {
            const doc = await this.hollandTestModel
                .findOne({ studentId })
                .sort({ testDate: -1 })
                .exec();
            if (!doc) return null;
            return this.mapDocumentToEntity(doc);
        } catch (error) {
            throw new PersistenceError(
                'Error al buscar último test',
                Exceptions.HOLLAND_TEST_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    async findAll(filters?: {
        studentId?: string;
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        dominantType?: string;
    }): Promise<HollandTestEntity[]> {
        try {
            const query: any = {};

            if (filters?.studentId) query.studentId = filters.studentId;
            if (filters?.status) query.status = filters.status;

            if (filters?.dateFrom || filters?.dateTo) {
                query.testDate = {};
                if (filters.dateFrom) query.testDate.$gte = filters.dateFrom;
                if (filters.dateTo) query.testDate.$lte = filters.dateTo;
            }

            if (filters?.dominantType) {
                query.dominantTypes = filters.dominantType;
            }

            const docs = await this.hollandTestModel
                .find(query)
                .sort({ testDate: -1 })
                .exec();
            return docs.map((doc) => this.mapDocumentToEntity(doc));
        } catch (error) {
            throw new PersistenceError(
                Exceptions.HOLLAND_TEST_LIST_ERROR.description,
                Exceptions.HOLLAND_TEST_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    async update(
        id: string,
        partialEntity: Partial<HollandTestEntity>,
    ): Promise<HollandTestEntity | null> {
        try {
            const updateDoc: any = {};

            if (partialEntity.scores !== undefined)
                updateDoc.scores = partialEntity.scores;
            if (partialEntity.dominantTypes !== undefined)
                updateDoc.dominantTypes = partialEntity.dominantTypes;
            if (partialEntity.interpretation !== undefined)
                updateDoc.interpretation = partialEntity.interpretation;
            if (partialEntity.recommendations !== undefined)
                updateDoc.recommendations = partialEntity.recommendations;
            if (partialEntity.status !== undefined)
                updateDoc.status = partialEntity.status;
            if (partialEntity.administeredBy !== undefined)
                updateDoc.administeredBy = partialEntity.administeredBy;
            if (partialEntity.updatedAt !== undefined)
                updateDoc.updatedAt = partialEntity.updatedAt;
            if (partialEntity.updatedBy !== undefined)
                updateDoc.updatedBy = partialEntity.updatedBy;

            const doc = await this.hollandTestModel
                .findByIdAndUpdate(id, { $set: updateDoc }, { new: true })
                .exec();

            if (!doc) return null;
            return this.mapDocumentToEntity(doc);
        } catch (error) {
            if ((error as any).name === 'CastError') return null;
            throw new PersistenceError(
                Exceptions.HOLLAND_TEST_NOT_UPDATED.description,
                Exceptions.HOLLAND_TEST_NOT_UPDATED.code,
                error as Error,
            );
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await this.hollandTestModel.findByIdAndDelete(id).exec();
            return result !== null;
        } catch (error) {
            if ((error as any).name === 'CastError') return false;
            throw new PersistenceError(
                Exceptions.HOLLAND_TEST_NOT_DELETED.description,
                Exceptions.HOLLAND_TEST_NOT_DELETED.code,
                error as Error,
            );
        }
    }

    private mapDocumentToEntity(doc: HollandTestDocument): HollandTestEntity {
        return new HollandTestEntity(
            doc._id.toString(),
            doc.studentId,
            doc.testDate,
            doc.scores,
            doc.dominantTypes,
            doc.interpretation,
            doc.recommendations,
            doc.status as any,
            doc.administeredBy,
            doc.createdAt,
            doc.createdBy,
            doc.updatedAt,
            doc.updatedBy,
        );
    }
}
