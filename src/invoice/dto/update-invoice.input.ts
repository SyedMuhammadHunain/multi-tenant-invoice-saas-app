
// src/invoice/dto/update-invoice.input.ts
import { InputType, Field, ID, Float } from '@nestjs/graphql';
import { IsOptional, IsArray, IsNumber, Min } from 'class-validator';
import { InvoiceItemInput } from './invoice-item.input';

@InputType()
export class UpdateInvoiceInput {
  @Field(() => ID)
  id: string;

  @Field(() => [InvoiceItemInput], { nullable: true })
  @IsArray()
  @IsOptional()
  items?: InvoiceItemInput[];

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxRate?: number;

  @Field({ nullable: true })
  @IsOptional()
  issueDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  dueDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;

  @Field({ nullable: true })
  @IsOptional()
  status?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  subtotal?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  taxAmount?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  total?: number;
}