import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum SportType {
  TENNIS = 'Tennis',
  PADEL = 'Padel',
  SQUASH = 'Squash',
  BADMINTON = 'Badminton',
  TABLE_TENNIS = 'Table Tennis',
  CHESS = 'Chess',
  GOLF = 'Golf',
}

export enum SkillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  PRO = 'Pro',
}

export enum RequestStatus {
  PENDING = 'Pending',
  MATCHED = 'Matched',
  CANCELLED = 'Cancelled',
}

@Schema({ timestamps: true })
export class MatchingRequest extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true, enum: SportType })
  sport: SportType;

  @Prop({ required: true, enum: SkillLevel })
  level: SkillLevel;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, type: Date })
  dateTimeStart: Date;

  @Prop({ required: true, type: Date })
  dateTimeEnd: Date;

  @Prop({ required: true, enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'MatchingRequest',
    default: null,
  })
  matchedWithRequestId: MongooseSchema.Types.ObjectId;
}

export const MatchingRequestSchema =
  SchemaFactory.createForClass(MatchingRequest);
