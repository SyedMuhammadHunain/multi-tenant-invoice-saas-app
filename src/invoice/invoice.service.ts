import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { Client, ClientDocument } from '../client/schemas/client.schema';
import { Tenant, TenantDocument } from '../tenant/schemas/tentant.schema';
import { CreateInvoiceInput } from './dto/create-invoice.input';
import { UpdateInvoiceInput } from './dto/update-invoice.input';
import { EmailService } from '../email/email.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    private emailService: EmailService,
  ) {}

  async create(createInvoiceInput: CreateInvoiceInput, tenantId: string): Promise<Invoice> {
    // Verify client belongs to tenant
    const client = await this.clientModel.findOne({
      _id: createInvoiceInput.clientId,
      tenantId,
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber(tenantId);

    // Calculate totals
    const subtotal = createInvoiceInput.items.reduce((sum, item) => {
      item.total = item.quantity * item.unitPrice;
      return sum + item.total;
    }, 0);

    const taxAmount = (subtotal * createInvoiceInput.taxRate) / 100;
    const total = subtotal + taxAmount;

    // Determine status based on due date
    const status = new Date(createInvoiceInput.dueDate) < new Date() ? 'overdue' : 'unpaid';

    const invoice = await this.invoiceModel.create({
      ...createInvoiceInput,
      invoiceNumber,
      tenantId,
      subtotal,
      taxAmount,
      total,
      status,
    });

    return invoice;
  }

  async findAll(tenantId: string, status?: string): Promise<Invoice[]> {
    const query: any = { tenantId };
    if (status) {
      query.status = status;
    }
    return this.invoiceModel.find(query).sort({ createdAt: -1 });
  }

  async findOne(id: string, tenantId: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findOne({ _id: id, tenantId });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  async update(id: string, updateInvoiceInput: UpdateInvoiceInput, tenantId: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findOne({ _id: id, tenantId });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Recalculate if items changed
    if (updateInvoiceInput.items) {
      const subtotal = updateInvoiceInput.items.reduce((sum, item) => {
        item.total = item.quantity * item.unitPrice;
        return sum + item.total;
      }, 0);

      const taxRate = updateInvoiceInput.taxRate ?? invoice.taxRate;
      const taxAmount = (subtotal * taxRate) / 100;
      const total = subtotal + taxAmount;

      updateInvoiceInput.subtotal = subtotal;
      updateInvoiceInput.taxAmount = taxAmount;
      updateInvoiceInput.total = total;
    }

    const updatedInvoice = await this.invoiceModel.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: updateInvoiceInput },
      { new: true },
    );

    if (!updatedInvoice) {
      throw new NotFoundException('Invoice not found');
    }

    return updatedInvoice;
  }

  async markAsPaid(id: string, tenantId: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: { status: 'paid', paidDate: new Date() } },
      { new: true },
    );
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  async sendInvoice(id: string, tenantId: string): Promise<boolean> {
    const invoice = await this.invoiceModel.findOne({ _id: id, tenantId });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const client = await this.clientModel.findById(invoice.clientId);
    const tenant = await this.tenantModel.findById(tenantId);

    if (!client || !tenant) {
      throw new BadRequestException('Client or Tenant not found');
    }

    await this.emailService.sendInvoiceEmail(invoice, client, tenant);
    return true;
  }

  async remove(id: string, tenantId: string): Promise<boolean> {
    const result = await this.invoiceModel.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: { status: 'cancelled' } },
    );
    if (!result) {
      throw new NotFoundException('Invoice not found');
    }
    return true;
  }

  async count(tenantId: string, status?: string): Promise<number> {
    const query: any = { tenantId };
    if (status) {
      query.status = status;
    }
    return this.invoiceModel.countDocuments(query);
  }

  async getTotalRevenue(tenantId: string): Promise<number> {
    const result = await this.invoiceModel.aggregate([
      { $match: { tenantId: tenantId, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    return result[0]?.total || 0;
  }

  private async generateInvoiceNumber(tenantId: string): Promise<string> {
    const count = await this.invoiceModel.countDocuments({ tenantId });
    const number = (count + 1).toString().padStart(4, '0');
    return `INV-${number}`;
  }

  async updateOverdueInvoices(): Promise<void> {
    await this.invoiceModel.updateMany(
      {
        status: 'unpaid',
        dueDate: { $lt: new Date() },
      },
      {
        $set: { status: 'overdue' },
      },
    );
  }
}