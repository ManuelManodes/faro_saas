import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface EmergencyContactDocument {
    name: string;
    phone: string;
    relationship: string;
}

@Schema({ collection: 'students', timestamps: true })
export class StudentDocument extends Document {
    @Prop({ required: true, unique: true })
    rut: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true, type: Date })
    birthDate: Date;

    @Prop({ required: true })
    grade: string;

    @Prop({ required: true })
    section: string;

    @Prop({ required: true })
    address: string;

    @Prop({
        required: true,
        type: {
            name: String,
            phone: String,
            relationship: String,
        },
    })
    emergencyContact: EmergencyContactDocument;

    @Prop({ required: true, enum: ['ACTIVO', 'INACTIVO', 'RETIRADO'] })
    status: string;

    @Prop({ required: true, type: Date })
    enrollmentDate: Date;

    @Prop({ required: true, type: Date })
    createdAt: Date;

    @Prop({ required: true })
    createdBy: string;

    @Prop({ type: Date })
    updatedAt?: Date;

    @Prop()
    updatedBy?: string;
}

export const StudentSchema = SchemaFactory.createForClass(StudentDocument);

// Indexes
StudentSchema.index({ rut: 1 }, { unique: true });
StudentSchema.index({ email: 1 }, { unique: true });
StudentSchema.index({ status: 1, grade: 1, section: 1 });
