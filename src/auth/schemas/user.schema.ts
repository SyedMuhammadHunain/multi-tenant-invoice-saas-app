import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';

export type UserDocument = User & Document;

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @HideField() // Hide password from GraphQL schema
  @Prop({ required: true })
  password: string;

  @Field(() => String)
  @Prop({ required: true, enum: ['admin', 'employee', 'client'] })
  role: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true })
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

export const UserSchema = SchemaFactory.createForClass(User);