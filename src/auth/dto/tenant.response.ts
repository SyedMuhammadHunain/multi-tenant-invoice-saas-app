
// src/auth/dto/tenant.response.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class TenantResponse {
  @Field(() => ID)
  _id: string;

  @Field()
  companyName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  logo?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  taxId?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  brandColor?: string;

  @Field()
  isActive: boolean;

  @Field()
  plan: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}