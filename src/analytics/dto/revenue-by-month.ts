
// src/analytics/dto/revenue-by-month.ts
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class RevenueByMonth {
  @Field()
  month: string;

  @Field(() => Float)
  revenue: number;

  @Field(() => Int)
  invoiceCount: number;
}
