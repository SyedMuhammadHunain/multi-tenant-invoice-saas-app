import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantService } from './tenant.service';
import { TenantResolver } from './tenant.resolver';
import { Tenant, TenantSchema } from './schemas/tentant.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    AuthModule,
  ],
  providers: [TenantService, TenantResolver],
  exports: [TenantService],
})
export class TenantModule {}