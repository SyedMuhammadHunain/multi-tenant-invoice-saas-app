import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateTenantInput {
  @Field({ nullable: true })
  @IsOptional()
  companyName?: string;

  @Field({ nullable: true })
  @IsOptional()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  taxId?: string;

  @Field({ nullable: true })
  @IsOptional()
  website?: string;

  @Field({ nullable: true })
  @IsOptional()
  brandColor?: string;
}