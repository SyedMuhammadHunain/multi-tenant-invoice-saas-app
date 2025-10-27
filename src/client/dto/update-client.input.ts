
// src/client/dto/update-client.input.ts
import { InputType, Field, ID } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';

@InputType()
export class UpdateClientInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  company?: string;

  @Field({ nullable: true })
  @IsOptional()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  taxId?: string;
}