// src/invoice/dto/invoice-item.input.ts
import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

@InputType()
export class InvoiceItemInput {
  @Field()
  @IsNotEmpty()
  description: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @Field(() => Float, { nullable: true })
  total?: number;
}
