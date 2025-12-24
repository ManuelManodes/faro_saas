import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface RIASECScoresDocument {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
}

@Schema({ collection: 'holland_tests', timestamps: true })
export class HollandTestDocument extends Document {
    @Prop({ required: true, index: true })
    studentId: string;

    @Prop({ required: true, type: Date, index: true })
    testDate: Date;

    @Prop({
        required: true,
        type: {
            realistic: Number,
            investigative: Number,
            artistic: Number,
            social: Number,
            enterprising: Number,
            conventional: Number,
        },
    })
    scores: RIASECScoresDocument;

    @Prop({ required: true, type: [String] })
    dominantTypes: string[];

    @Prop({ required: true })
    interpretation: string;

    @Prop({ required: true, type: [String] })
    recommendations: string[];

    @Prop({
        required: true,
        enum: ['COMPLETADO', 'INCOMPLETO', 'INVALIDADO'],
    })
    status: string;

    @Prop({ required: true })
    administeredBy: string;

    @Prop({ required: true, type: Date })
    createdAt: Date;

    @Prop({ required: true })
    createdBy: string;

    @Prop({ type: Date })
    updatedAt?: Date;

    @Prop()
    updatedBy?: string;
}

export const HollandTestSchema =
    SchemaFactory.createForClass(HollandTestDocument);

// Indexes
HollandTestSchema.index({ studentId: 1, testDate: -1 });
HollandTestSchema.index({ status: 1 });
HollandTestSchema.index({ dominantTypes: 1 });
