// src/analytics/dto/dashboard-stats.ts
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class DashboardStats {
  @Field(() => Int)
  totalClients: number;

  @Field(() => Int)
  totalInvoices: number;

  @Field(() => Int)
  unpaidInvoices: number;

  @Field(() => Int)
  overdueInvoices: number;

  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Float)
  pendingAmount: number;
}
