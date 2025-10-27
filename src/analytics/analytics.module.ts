import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResolver } from './analytics.resolver';
import { Invoice, InvoiceSchema } from '../invoice/schemas/invoice.schema';
import { Client, ClientSchema } from '../client/schemas/client.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
    AuthModule,
  ],
  providers: [AnalyticsService, AnalyticsResolver],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}