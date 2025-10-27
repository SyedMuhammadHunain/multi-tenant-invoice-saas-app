
// src/auth/dto/auth.response.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { UserResponse } from './user.response';
import { TenantResponse } from './tenant.response';

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field(() => UserResponse)
  user: UserResponse;

  @Field(() => TenantResponse)
  tenant: TenantResponse;
}