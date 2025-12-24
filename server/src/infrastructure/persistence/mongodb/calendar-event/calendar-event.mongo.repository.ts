import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CalendarEventDocument } from './calendar-event.schema';
import { CalendarEventEntity } from '../../../../domain/calendar-event/entity/calendar-event.entity';
import { CalendarEventRepositoryPort } from '../../../../domain/calendar-event/repository.port';
import {
    PersistenceError,
    Exceptions,
} from '../../../../domain/calendar-event/exceptions';

@Injectable()
export class CalendarEventMongoRepository
    implements CalendarEventRepositoryPort {
    constructor(
        @InjectModel('CalendarEvent')
        private readonly calendarEventModel: Model<CalendarEventDocument>,
    ) { }

    async save(entity: CalendarEventEntity): Promise<CalendarEventEntity> {
        try {
            const doc = new this.calendarEventModel({
                title: entity.title,
                description: entity.description,
                eventType: entity.eventType,
                startDate: entity.startDate,
                endDate: entity.endDate,
                startTime: entity.startTime,
                endTime: entity.endTime,
                location: entity.location,
                courseId: entity.courseId,
                isAllDay: entity.isAllDay,
                status: entity.status,
                organizerEmail: entity.organizerEmail,
                attendees: entity.attendees,
                createdAt: entity.createdAt,
                createdBy: entity.createdBy,
                updatedAt: entity.updatedAt,
                updatedBy: entity.updatedBy,
            });

            const saved = await doc.save();
            return this.mapDocumentToEntity(saved);
        } catch (error) {
            throw new PersistenceError(
                Exceptions.EVENT_NOT_CREATED.description,
                Exceptions.EVENT_NOT_CREATED.code,
                error as Error,
            );
        }
    }

    async findById(id: string): Promise<CalendarEventEntity | null> {
        try {
            const doc = await this.calendarEventModel.findById(id).exec();
            if (!doc) return null;
            return this.mapDocumentToEntity(doc);
        } catch (error) {
            if ((error as any).name === 'CastError') return null;
            throw new PersistenceError(
                Exceptions.EVENT_NOT_FOUND.description.replace('${0}', id),
                Exceptions.EVENT_NOT_FOUND.code,
                error as Error,
            );
        }
    }

    async findAll(filters?: {
        eventType?: string;
        status?: string;
        startDate?: Date;
        endDate?: Date;
        courseId?: string;
        organizerEmail?: string;
    }): Promise<CalendarEventEntity[]> {
        try {
            const query: any = {};

            if (filters?.eventType) query.eventType = filters.eventType;
            if (filters?.status) query.status = filters.status;
            if (filters?.courseId) query.courseId = filters.courseId;
            if (filters?.organizerEmail)
                query.organizerEmail = filters.organizerEmail;

            if (filters?.startDate || filters?.endDate) {
                query.$or = [];
                if (filters.startDate && filters.endDate) {
                    // Events that overlap with the date range
                    query.$or.push({
                        $and: [
                            { startDate: { $lte: filters.endDate } },
                            { endDate: { $gte: filters.startDate } },
                        ],
                    });
                } else if (filters.startDate) {
                    query.endDate = { $gte: filters.startDate };
                } else if (filters.endDate) {
                    query.startDate = { $lte: filters.endDate };
                }

                if (query.$or.length === 0) delete query.$or;
            }

            const docs = await this.calendarEventModel
                .find(query)
                .sort({ startDate: 1 })
                .exec();
            return docs.map((doc) => this.mapDocumentToEntity(doc));
        } catch (error) {
            throw new PersistenceError(
                Exceptions.EVENT_LIST_ERROR.description,
                Exceptions.EVENT_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    async findByDateRange(
        startDate: Date,
        endDate: Date,
    ): Promise<CalendarEventEntity[]> {
        try {
            const docs = await this.calendarEventModel
                .find({
                    $and: [
                        { startDate: { $lte: endDate } },
                        { endDate: { $gte: startDate } },
                    ],
                })
                .sort({ startDate: 1 })
                .exec();
            return docs.map((doc) => this.mapDocumentToEntity(doc));
        } catch (error) {
            throw new PersistenceError(
                'Error al buscar eventos por rango de fechas',
                Exceptions.EVENT_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    async findUpcomingEvents(limit: number = 10): Promise<CalendarEventEntity[]> {
        try {
            const now = new Date();
            const docs = await this.calendarEventModel
                .find({
                    startDate: { $gte: now },
                    status: { $ne: 'CANCELADO' },
                })
                .sort({ startDate: 1 })
                .limit(limit)
                .exec();
            return docs.map((doc) => this.mapDocumentToEntity(doc));
        } catch (error) {
            throw new PersistenceError(
                'Error al buscar próximos eventos',
                Exceptions.EVENT_LIST_ERROR.code,
                error as Error,
            );
        }
    }

    async update(
        id: string,
        partialEntity: Partial<CalendarEventEntity>,
    ): Promise<CalendarEventEntity | null> {
        try {
            const updateDoc: any = {};

            if (partialEntity.title !== undefined)
                updateDoc.title = partialEntity.title;
            if (partialEntity.description !== undefined)
                updateDoc.description = partialEntity.description;
            if (partialEntity.eventType !== undefined)
                updateDoc.eventType = partialEntity.eventType;
            if (partialEntity.startDate !== undefined)
                updateDoc.startDate = partialEntity.startDate;
            if (partialEntity.endDate !== undefined)
                updateDoc.endDate = partialEntity.endDate;
            if (partialEntity.startTime !== undefined)
                updateDoc.startTime = partialEntity.startTime;
            if (partialEntity.endTime !== undefined)
                updateDoc.endTime = partialEntity.endTime;
            if (partialEntity.location !== undefined)
                updateDoc.location = partialEntity.location;
            if (partialEntity.courseId !== undefined)
                updateDoc.courseId = partialEntity.courseId;
            if (partialEntity.isAllDay !== undefined)
                updateDoc.isAllDay = partialEntity.isAllDay;
            if (partialEntity.status !== undefined)
                updateDoc.status = partialEntity.status;
            if (partialEntity.organizerEmail !== undefined)
                updateDoc.organizerEmail = partialEntity.organizerEmail;
            if (partialEntity.attendees !== undefined)
                updateDoc.attendees = partialEntity.attendees;
            if (partialEntity.updatedAt !== undefined)
                updateDoc.updatedAt = partialEntity.updatedAt;
            if (partialEntity.updatedBy !== undefined)
                updateDoc.updatedBy = partialEntity.updatedBy;

            const doc = await this.calendarEventModel
                .findByIdAndUpdate(id, { $set: updateDoc }, { new: true })
                .exec();

            if (!doc) return null;
            return this.mapDocumentToEntity(doc);
        } catch (error) {
            if ((error as any).name === 'CastError') return null;
            throw new PersistenceError(
                Exceptions.EVENT_NOT_UPDATED.description,
                Exceptions.EVENT_NOT_UPDATED.code,
                error as Error,
            );
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await this.calendarEventModel
                .findByIdAndDelete(id)
                .exec();
            return result !== null;
        } catch (error) {
            if ((error as any).name === 'CastError') return false;
            throw new PersistenceError(
                Exceptions.EVENT_NOT_DELETED.description,
                Exceptions.EVENT_NOT_DELETED.code,
                error as Error,
            );
        }
    }

    private mapDocumentToEntity(
        doc: CalendarEventDocument,
    ): CalendarEventEntity {
        return new CalendarEventEntity(
            doc._id.toString(),
            doc.title,
            doc.description,
            doc.eventType as any,
            doc.startDate,
            doc.endDate,
            doc.isAllDay,
            doc.status as any,
            doc.organizerEmail,
            doc.attendees,
            doc.createdAt,
            doc.createdBy,
            doc.startTime,
            doc.endTime,
            doc.location,
            doc.courseId,
            doc.updatedAt,
            doc.updatedBy,
        );
    }
}
