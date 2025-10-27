
// src/invoice/dto/create-invoice.input.ts
import { InputType, Field, ID, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsArray, IsNumber, Min } from 'class-validator';
import { InvoiceItemInput } from './invoice-item.input';

@InputType()
export class CreateInvoiceInput {
  @Field(() => ID)
  @IsNotEmpty()
  clientId: string;

  @Field(() => [InvoiceItemInput])
  @IsArray()
  items: InvoiceItemInput[];

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  taxRate: number;

  @Field()
  @IsNotEmpty()
  issueDate: Date;

  @Field()
  @IsNotEmpty()
  dueDate: Date;

  @Field({ nullable: true })
  notes?: string;
}
