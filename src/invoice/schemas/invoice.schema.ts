import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class InvoiceItem {
  @Field()
  @Prop({ required: true })
  description: string;

  @Field(() => Int)
  @Prop({ required: true })
  quantity: number;

  @Field(() => Float)
  @Prop({ required: true })
  unitPrice: number;

  @Field(() => Float)
  @Prop({ required: true })
  total: number;
}

const InvoiceItemSchema = new MongooseSchema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },
});

export type InvoiceDocument = Invoice & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Invoice {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  invoiceNumber: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Client', required: true })
  clientId: string;

  @Field(() => [InvoiceItem])
  @Prop({ type: [InvoiceItemSchema], required: true })
  items: InvoiceItem[];

  @Field(() => Float)
  @Prop({ required: true })
  subtotal: number;

  @Field(() => Float)
  @Prop({ default: 0 })
  taxRate: number;

  @Field(() => Float)
  @Prop({ required: true })
  taxAmount: number;

  @Field(() => Float)
  @Prop({ required: true })
  total: number;

  @Field()
  @Prop({ required: true })
  issueDate: Date;

  @Field()
  @Prop({ required: true })
  dueDate: Date;

  @Field(() => String)
  @Prop({ required: true, enum: ['unpaid', 'paid', 'overdue', 'cancelled'], default: 'unpaid' })
  status: string;

  @Field({ nullable: true })
  @Prop()
  notes?: string;

  @Field({ nullable: true })
  @Prop()
  paidDate?: Date;

  @Field({ nullable: true })
  @Prop()
  pdfUrl?: string;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);