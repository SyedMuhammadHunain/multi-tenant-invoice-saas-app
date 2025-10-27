import { Resolver, Query, Mutation, Args, Context, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Invoice } from './schemas/invoice.schema';
import { CreateInvoiceInput } from './dto/create-invoice.input';
import { UpdateInvoiceInput } from './dto/update-invoice.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from '../client/schemas/client.schema';

@Resolver(() => Invoice)
@UseGuards(GqlAuthGuard)
export class InvoiceResolver {
  constructor(
    private readonly invoiceService: InvoiceService,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  @Mutation(() => Invoice)
  async createInvoice(
    @Args('createInvoiceInput') createInvoiceInput: CreateInvoiceInput,
    @Context() context,
  ): Promise<Invoice> {
    const tenantId = context.req.user.tenantId;
    return this.invoiceService.create(createInvoiceInput, tenantId);
  }

  @Query(() => [Invoice], { name: 'invoices' })
  async findAll(
    @Args('status', { nullable: true }) status: string,
    @Context() context,
  ): Promise<Invoice[]> {
    const tenantId = context.req.user.tenantId;
    return this.invoiceService.findAll(tenantId, status);
  }

  @Query(() => Invoice, { name: 'invoice' })
  async findOne(@Args('id') id: string, @Context() context): Promise<Invoice> {
    const tenantId = context.req.user.tenantId;
    return this.invoiceService.findOne(id, tenantId);
  }

  @Mutation(() => Invoice)
  async updateInvoice(
    @Args('updateInvoiceInput') updateInvoiceInput: UpdateInvoiceInput,
    @Context() context,
  ): Promise<Invoice> {
    const tenantId = context.req.user.tenantId;
    return this.invoiceService.update(updateInvoiceInput.id, updateInvoiceInput, tenantId);
  }

  @Mutation(() => Invoice)
  async markInvoiceAsPaid(@Args('id') id: string, @Context() context): Promise<Invoice> {
    const tenantId = context.req.user.tenantId;
    return this.invoiceService.markAsPaid(id, tenantId);
  }

  @Mutation(() => Boolean)
  async sendInvoice(@Args('id') id: string, @Context() context): Promise<boolean> {
    const tenantId = context.req.user.tenantId;
    return this.invoiceService.sendInvoice(id, tenantId);
  }

  @Mutation(() => Boolean)
  async deleteInvoice(@Args('id') id: string, @Context() context): Promise<boolean> {
    const tenantId = context.req.user.tenantId;
    return this.invoiceService.remove(id, tenantId);
  }

  @ResolveField(() => Client, { nullable: true })
  async client(@Parent() invoice: Invoice): Promise<Client | null> {
    return this.clientModel.findById(invoice.clientId);
  }
}