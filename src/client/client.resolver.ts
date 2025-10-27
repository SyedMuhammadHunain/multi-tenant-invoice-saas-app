import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './schemas/client.schema';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => Client)
@UseGuards(GqlAuthGuard)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Mutation(() => Client)
  async createClient(
    @Args('createClientInput') createClientInput: CreateClientInput,
    @Context() context,
  ): Promise<Client> {
    const tenantId = context.req.user.tenantId;
    return this.clientService.create(createClientInput, tenantId);
  }

  @Query(() => [Client], { name: 'clients' })
  async findAll(@Context() context): Promise<Client[]> {
    const tenantId = context.req.user.tenantId;
    return this.clientService.findAll(tenantId);
  }

  @Query(() => Client, { name: 'client' })
  async findOne(@Args('id') id: string, @Context() context): Promise<Client> {
    const tenantId = context.req.user.tenantId;
    return this.clientService.findOne(id, tenantId);
  }

  @Mutation(() => Client)
  async updateClient(
    @Args('updateClientInput') updateClientInput: UpdateClientInput,
    @Context() context,
  ): Promise<Client> {
    const tenantId = context.req.user.tenantId;
    return this.clientService.update(
      updateClientInput.id,
      updateClientInput,
      tenantId,
    );
  }

  @Mutation(() => Boolean)
  async deleteClient(
    @Args('id') id: string,
    @Context() context,
  ): Promise<boolean> {
    const tenantId = context.req.user.tenantId;
    return this.clientService.remove(id, tenantId);
  }
}
