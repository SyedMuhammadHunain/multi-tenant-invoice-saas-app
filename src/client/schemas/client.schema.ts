import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

export type ClientDocument = Client & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Client {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  email: string;

  @Field({ nullable: true })
  @Prop()
  phone?: string;

  @Field({ nullable: true })
  @Prop()
  company?: string;

  @Field({ nullable: true })
  @Prop()
  address?: string;

  @Field({ nullable: true })
  @Prop()
  taxId?: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: string;

  @Field(() => Boolean)
  @Prop({ default: true })
  isActive: boolean;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);