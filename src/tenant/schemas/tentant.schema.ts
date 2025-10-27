import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';

export type TenantDocument = Tenant & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Tenant {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  companyName: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @HideField() // Hide password from GraphQL schema
  @Prop({ required: true })
  password: string;

  @Field({ nullable: true })
  @Prop()
  logo?: string;

  @Field({ nullable: true })
  @Prop()
  address?: string;

  @Field({ nullable: true })
  @Prop()
  phone?: string;

  @Field({ nullable: true })
  @Prop()
  taxId?: string;

  @Field({ nullable: true })
  @Prop()
  website?: string;

  @Field(() => String, { nullable: true })
  @Prop({ default: '#3B82F6' })
  brandColor?: string;

  @Field(() => Boolean)
  @Prop({ default: true })
  isActive: boolean;

  @Field(() => String)
  @Prop({ default: 'trial', enum: ['trial', 'basic', 'premium', 'enterprise'] })
  plan: string;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);