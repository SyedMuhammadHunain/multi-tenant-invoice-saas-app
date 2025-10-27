import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  async create(createClientInput: CreateClientInput, tenantId: string): Promise<Client> {
    const client = await this.clientModel.create({
      ...createClientInput,
      tenantId,
    });
    return client;
  }

  async findAll(tenantId: string): Promise<Client[]> {
    return this.clientModel.find({ tenantId, isActive: true }).sort({ createdAt: -1 });
  }

  async findOne(id: string, tenantId: string): Promise<Client> {
    const client = await this.clientModel.findOne({ _id: id, tenantId, isActive: true });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  async update(id: string, updateClientInput: UpdateClientInput, tenantId: string): Promise<Client> {
    const client = await this.clientModel.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: updateClientInput },
      { new: true },
    );
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  async remove(id: string, tenantId: string): Promise<boolean> {
    const result = await this.clientModel.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: { isActive: false } },
    );
    if (!result) {
      throw new NotFoundException('Client not found');
    }
    return true;
  }

  async count(tenantId: string): Promise<number> {
    return this.clientModel.countDocuments({ tenantId, isActive: true });
  }
}