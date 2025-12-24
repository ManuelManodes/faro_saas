import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'calendar_events', timestamps: true })
export class CalendarEventDocument extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({
        required: true,
        enum: [
            'FERIADO',
            'EVALUACION',
            'REUNION',
            'EVENTO_INSTITUCIONAL',
            'ACTIVIDAD_EXTRACURRICULAR',
            'VACACIONES',
        ],
        index: true,
    })
    eventType: string;

    @Prop({ required: true, type: Date, index: true })
    startDate: Date;

    @Prop({ required: true, type: Date, index: true })
    endDate: Date;

    @Prop()
    startTime?: string;

    @Prop()
    endTime?: string;

    @Prop()
    location?: string;

    @Prop({ index: true })
    courseId?: string;

    @Prop({ required: true, default: true })
    isAllDay: boolean;

    @Prop({
        required: true,
        enum: ['PROGRAMADO', 'CONFIRMADO', 'CANCELADO', 'COMPLETADO'],
        index: true,
    })
    status: string;

    @Prop({ required: true, index: true })
    organizerEmail: string;

    @Prop({ type: [String], default: [] })
    attendees: string[];

    @Prop({ required: true, type: Date })
    createdAt: Date;

    @Prop({ required: true })
    createdBy: string;

    @Prop({ type: Date })
    updatedAt?: Date;

    @Prop()
    updatedBy?: string;
}

export const CalendarEventSchema =
    SchemaFactory.createForClass(CalendarEventDocument);

// Compound indexes
CalendarEventSchema.index({ startDate: 1, endDate: 1 });
CalendarEventSchema.index({ eventType: 1, status: 1 });
CalendarEventSchema.index({ organizerEmail: 1, startDate: -1 });
