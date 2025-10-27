import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceResolver } from './invoice.resolver';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { Client, ClientSchema } from '../client/schemas/client.schema';
import { Tenant, TenantSchema } from '../tenant/schemas/tentant.schema';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Tenant.name, schema: TenantSchema },
    ]),
    AuthModule,
    EmailModule,
  ],
  providers: [InvoiceService, InvoiceResolver],
  exports: [InvoiceService],
})
export class InvoiceModule {}