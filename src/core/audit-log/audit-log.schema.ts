import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AuditLog {
  @Prop()
  admin?: string;

  @Prop()
  action?: string;

  @Prop()
  ip?: string;

  @Prop({ type: Date })
  date?: Date;

  @Prop({ required: false })
  requestBody?: string;
}

export type AuditLogDocument = AuditLog & Document;
export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
