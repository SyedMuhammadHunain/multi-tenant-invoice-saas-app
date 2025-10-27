import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from '../tenant/schemas/tentant.schema';

@Injectable()
export class UploadService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadLogo(file: string, tenantId: string): Promise<string> {
    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file, {
        folder: 'invoice-saas/logos',
        public_id: `tenant_${tenantId}_${Date.now()}`,
        transformation: [
          { width: 300, height: 300, crop: 'limit' },
          { quality: 'auto' },
        ],
      });

      // Update tenant with logo URL
      await this.tenantModel.findByIdAndUpdate(tenantId, {
        logo: result.secure_url,
      });

      return result.secure_url;
    } catch (error) {
      throw new Error(`Failed to upload logo: ${error.message}`);
    }
  }

  async deleteLogo(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(`Failed to delete logo: ${error.message}`);
    }
  }
}