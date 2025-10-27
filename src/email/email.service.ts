import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Invoice } from '../invoice/schemas/invoice.schema';
import { Client } from '../client/schemas/client.schema';
import { Tenant } from '../tenant/schemas/tentant.schema';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SECURE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendInvoiceEmail(invoice: Invoice, client: Client, tenant: Tenant): Promise<void> {
    const emailHtml = this.generateInvoiceEmailTemplate(invoice, client, tenant);

    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_FROM'),
      to: client.email,
      subject: `Invoice ${invoice.invoiceNumber} from ${tenant.companyName}`,
      html: emailHtml,
    });
  }

  private generateInvoiceEmailTemplate(invoice: Invoice, client: Client, tenant: Tenant): string {
    const itemsHtml = invoice.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.unitPrice.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.total.toFixed(2)}</td>
        </tr>
      `,
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${invoice.invoiceNumber}</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f3f4f6;">
        <div style="max-width: 800px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            ${tenant.logo ? `<img src="${tenant.logo}" alt="${tenant.companyName}" style="max-width: 150px; margin-bottom: 20px;">` : ''}
            <h1 style="color: ${tenant.brandColor || '#3B82F6'}; margin: 0;">Invoice</h1>
            <p style="color: #6b7280; font-size: 18px;">#${invoice.invoiceNumber}</p>
          </div>

          <!-- Company & Client Info -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <div>
              <h3 style="color: #374151; margin-bottom: 10px;">From:</h3>
              <p style="margin: 5px 0;"><strong>${tenant.companyName}</strong></p>
              ${tenant.address ? `<p style="margin: 5px 0; color: #6b7280;">${tenant.address}</p>` : ''}
              ${tenant.phone ? `<p style="margin: 5px 0; color: #6b7280;">${tenant.phone}</p>` : ''}
              <p style="margin: 5px 0; color: #6b7280;">${tenant.email}</p>
            </div>
            <div>
              <h3 style="color: #374151; margin-bottom: 10px;">Bill To:</h3>
              <p style="margin: 5px 0;"><strong>${client.name}</strong></p>
              ${client.company ? `<p style="margin: 5px 0; color: #6b7280;">${client.company}</p>` : ''}
              ${client.address ? `<p style="margin: 5px 0; color: #6b7280;">${client.address}</p>` : ''}
              <p style="margin: 5px 0; color: #6b7280;">${client.email}</p>
            </div>
          </div>

          <!-- Invoice Details -->
          <div style="margin-bottom: 30px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0;"><strong>Issue Date:</strong></td>
                <td style="padding: 5px 0; text-align: right;">${new Date(invoice.issueDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;"><strong>Due Date:</strong></td>
                <td style="padding: 5px 0; text-align: right;">${new Date(invoice.dueDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;"><strong>Status:</strong></td>
                <td style="padding: 5px 0; text-align: right;">
                  <span style="background-color: ${invoice.status === 'paid' ? '#10b981' : '#f59e0b'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">
                    ${invoice.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Description</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Unit Price</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Totals -->
          <div style="text-align: right; margin-top: 30px;">
            <table style="width: 300px; margin-left: auto;">
              <tr>
                <td style="padding: 8px 0;"><strong>Subtotal:</strong></td>
                <td style="padding: 8px 0; text-align: right;">${invoice.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Tax (${invoice.taxRate}%):</strong></td>
                <td style="padding: 8px 0; text-align: right;">${invoice.taxAmount.toFixed(2)}</td>
              </tr>
              <tr style="border-top: 2px solid #e5e7eb;">
                <td style="padding: 12px 0;"><strong style="font-size: 18px;">Total:</strong></td>
                <td style="padding: 12px 0; text-align: right;"><strong style="font-size: 18px; color: ${tenant.brandColor || '#3B82F6'};">${invoice.total.toFixed(2)}</strong></td>
              </tr>
            </table>
          </div>

          ${invoice.notes ? `
          <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #374151;">Notes:</h3>
            <p style="color: #6b7280; margin: 0;">${invoice.notes}</p>
          </div>
          ` : ''}

          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
            <p>Thank you for your business!</p>
            ${tenant.website ? `<p>Visit us at <a href="${tenant.website}" style="color: ${tenant.brandColor || '#3B82F6'};">${tenant.website}</a></p>` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
  }
}