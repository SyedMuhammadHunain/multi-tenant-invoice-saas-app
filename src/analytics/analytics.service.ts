import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from '../invoice/schemas/invoice.schema';
import { Client, ClientDocument } from '../client/schemas/client.schema';
import { DashboardStats } from './dto/dashboard-stats';
import { RevenueByMonth } from './dto/revenue-by-month';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  async getDashboardStats(tenantId: string): Promise<DashboardStats> {
    const totalClients = await this.clientModel.countDocuments({ tenantId, isActive: true });
    const totalInvoices = await this.invoiceModel.countDocuments({ tenantId });
    const unpaidInvoices = await this.invoiceModel.countDocuments({ tenantId, status: 'unpaid' });
    const overdueInvoices = await this.invoiceModel.countDocuments({ tenantId, status: 'overdue' });

    const revenueResult = await this.invoiceModel.aggregate([
      { $match: { tenantId, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const pendingResult = await this.invoiceModel.aggregate([
      { $match: { tenantId, status: { $in: ['unpaid', 'overdue'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const pendingAmount = pendingResult[0]?.total || 0;

    return {
      totalClients,
      totalInvoices,
      unpaidInvoices,
      overdueInvoices,
      totalRevenue,
      pendingAmount,
    };
  }

  async getRevenueByMonth(tenantId: string, year: number): Promise<RevenueByMonth[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const result = await this.invoiceModel.aggregate([
      {
        $match: {
          tenantId,
          status: 'paid',
          paidDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $month: '$paidDate' },
          total: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueByMonth: RevenueByMonth[] = [];

    for (let i = 1; i <= 12; i++) {
      const monthData = result.find((r) => r._id === i);
      revenueByMonth.push({
        month: monthNames[i - 1],
        revenue: monthData?.total || 0,
        invoiceCount: monthData?.count || 0,
      });
    }

    return revenueByMonth;
  }

  async getTopClients(tenantId: string, limit: number = 5): Promise<any[]> {
    return this.invoiceModel.aggregate([
      { $match: { tenantId, status: 'paid' } },
      {
        $group: {
          _id: '$clientId',
          totalRevenue: { $sum: '$total' },
          invoiceCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'clients',
          localField: '_id',
          foreignField: '_id',
          as: 'client',
        },
      },
      { $unwind: '$client' },
      {
        $project: {
          clientId: '$_id',
          clientName: '$client.name',
          totalRevenue: 1,
          invoiceCount: 1,
        },
      },
    ]);
  }
}