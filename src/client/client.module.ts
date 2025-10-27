import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientService } from './client.service';
import { ClientResolver } from './client.resolver';
import { Client, ClientSchema } from './schemas/client.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    AuthModule,
  ],
  providers: [ClientService, ClientResolver],
  exports: [ClientService],
})
export class ClientModule {}
