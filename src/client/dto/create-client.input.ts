// src/client/dto/create-client.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateClientInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  email: string;

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
