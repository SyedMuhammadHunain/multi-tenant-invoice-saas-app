import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from './schemas/tentant.schema';
import { UpdateTenantInput } from './dto/update-tenant.input';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
  ) {}

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantModel.findById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }

  async update(id: string, updateTenantInput: UpdateTenantInput): Promise<Tenant> {
    const tenant = await this.tenantModel.findByIdAndUpdate(
      id,
      { $set: updateTenantInput },
      { new: true },
    );
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }
}