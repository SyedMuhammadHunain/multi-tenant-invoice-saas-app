import { Resolver, Query, Args, Context, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { DashboardStats } from './dto/dashboard-stats';
import { RevenueByMonth } from './dto/revenue-by-month';
import { TopClient } from './dto/top-client';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Query(() => DashboardStats)
  async dashboardStats(@Context() context): Promise<DashboardStats> {
    const tenantId = context.req.user.tenantId;
    return this.analyticsService.getDashboardStats(tenantId);
  }

  @Query(() => [RevenueByMonth])
  async revenueByMonth(
    @Args('year', { type: () => Int }) year: number,
    @Context() context,
  ): Promise<RevenueByMonth[]> {
    const tenantId = context.req.user.tenantId;
    return this.analyticsService.getRevenueByMonth(tenantId, year);
  }

  @Query(() => [TopClient])
  async topClients(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 5 }) limit: number,
    @Context() context,
  ): Promise<TopClient[]> {
    const tenantId = context.req.user.tenantId;
    return this.analyticsService.getTopClients(tenantId, limit);
  }
}