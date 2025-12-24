import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'attendances', timestamps: true })
export class AttendanceDocument extends Document {
    @Prop({ required: true, index: true })
    studentId: string;

    @Prop({ required: true, index: true })
    courseId: string;

    @Prop({ required: true, type: Date, index: true })
    date: Date;

    @Prop({
        required: true,
        enum: ['PRESENTE', 'AUSENTE', 'TARDE', 'JUSTIFICADO'],
    })
    status: string;

    @Prop()
    arrivalTime?: string;

    @Prop({ maxlength: 500 })
    notes?: string;

    @Prop()
    justificationDocument?: string;

    @Prop({ required: true })
    recordedBy: string;

    @Prop({ required: true, type: Date })
    createdAt: Date;

    @Prop({ required: true })
    createdBy: string;

    @Prop({ type: Date })
    updatedAt?: Date;

    @Prop()
    updatedBy?: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(AttendanceDocument);

// Compound unique index: same student + course + date
AttendanceSchema.index({ studentId: 1, courseId: 1, date: 1 }, { unique: true });

// Index for date range queries
AttendanceSchema.index({ date: 1, status: 1 });

// Index for student summaries
AttendanceSchema.index({ studentId: 1, date: 1 });

// Index for course summaries
AttendanceSchema.index({ courseId: 1, date: 1 });
