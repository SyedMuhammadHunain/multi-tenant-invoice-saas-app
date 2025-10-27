import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadService } from './upload.service';
import { UploadResolver } from './upload.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from '../tenant/schemas/tentant.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    AuthModule,
  ],
  providers: [UploadService, UploadResolver],
  exports: [UploadService],
})
export class UploadModule {}