import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Tenant } from './schemas/tentant.schema';
import { UpdateTenantInput } from './dto/update-tenant.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => Tenant)
@UseGuards(GqlAuthGuard)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query(() => Tenant)
  async tenant(@Context() context): Promise<Tenant> {
    const tenantId = context.req.user.tenantId;
    return this.tenantService.findOne(tenantId);
  }

  @Mutation(() => Tenant)
  async updateTenant(
    @Args('updateTenantInput') updateTenantInput: UpdateTenantInput,
    @Context() context,
  ): Promise<Tenant> {
    const tenantId = context.req.user.tenantId;
    return this.tenantService.update(tenantId, updateTenantInput);
  }
}