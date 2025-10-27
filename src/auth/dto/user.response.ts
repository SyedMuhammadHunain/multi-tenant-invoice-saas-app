
// src/auth/dto/user.response.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserResponse {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field(() => ID)
  tenantId: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
