
// src/analytics/dto/top-client.ts
import { ObjectType, Field, Float, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class TopClient {
  @Field(() => ID)
  clientId: string;

  @Field()
  clientName: string;

  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Int)
  invoiceCount: number;
}