import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface CourseScheduleDocument {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}

@Schema({ collection: 'courses', timestamps: true })
export class CourseDocument extends Document {
    @Prop({ required: true, unique: true })
    code: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    grade: string;

    @Prop({ required: true })
    section: string;

    @Prop({ required: true })
    subject: string;

    @Prop({ required: true })
    teacherName: string;

    @Prop({ required: true })
    teacherEmail: string;

    @Prop({
        required: true,
        type: [
            {
                dayOfWeek: String,
                startTime: String,
                endTime: String,
            },
        ],
    })
    schedule: CourseScheduleDocument[];

    @Prop({ required: true })
    capacity: number;

    @Prop({ required: true, default: 0 })
    enrolledCount: number;

    @Prop({ required: true })
    academicYear: number;

    @Prop({ required: true })
    semester: number;

    @Prop({ required: true, enum: ['ACTIVO', 'INACTIVO', 'FINALIZADO'] })
    status: string;

    @Prop({ required: true, type: Date })
    createdAt: Date;

    @Prop({ required: true })
    createdBy: string;

    @Prop({ type: Date })
    updatedAt?: Date;

    @Prop()
    updatedBy?: string;
}

export const CourseSchema = SchemaFactory.createForClass(CourseDocument);

// Indexes
CourseSchema.index({ code: 1 }, { unique: true });
CourseSchema.index({ grade: 1, section: 1, academicYear: 1 });
CourseSchema.index({ teacherEmail: 1, status: 1 });
CourseSchema.index({ subject: 1, academicYear: 1 });
