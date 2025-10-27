import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { Tenant, TenantDocument } from '../tenant/schemas/tentant.schema';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth.response';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    const { companyName, email, password, name } = registerInput;

    // Check if tenant already exists
    const existingTenant = await this.tenantModel.findOne({ email });
    if (existingTenant) {
      throw new ConflictException('Company email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create tenant
    const tenant = await this.tenantModel.create({
      companyName,
      email,
      password: hashedPassword,
      isActive: true,
      plan: 'trial',
    });

    // Create admin user for this tenant
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      tenantId: tenant._id,
      isActive: true,
    });

    // Generate JWT token
    const token = this.jwtService.sign({
      userId: user._id,
      tenantId: tenant._id,
      role: user.role,
    });

    return {
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId.toString(),
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tenant: {
        _id: tenant._id.toString(),
        companyName: tenant.companyName,
        email: tenant.email,
        logo: tenant.logo,
        address: tenant.address,
        phone: tenant.phone,
        taxId: tenant.taxId,
        website: tenant.website,
        brandColor: tenant.brandColor,
        isActive: tenant.isActive,
        plan: tenant.plan,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      },
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;

    // Find user
    const user = await this.userModel.findOne({ email, isActive: true });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get tenant
    const tenant = await this.tenantModel.findById(user.tenantId);
    if (!tenant || !tenant.isActive) {
      throw new UnauthorizedException('Tenant not found or inactive');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      userId: user._id,
      tenantId: tenant._id,
      role: user.role,
    });

    return {
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId.toString(),
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tenant: {
        _id: tenant._id.toString(),
        companyName: tenant.companyName,
        email: tenant.email,
        logo: tenant.logo,
        address: tenant.address,
        phone: tenant.phone,
        taxId: tenant.taxId,
        website: tenant.website,
        brandColor: tenant.brandColor,
        isActive: tenant.isActive,
        plan: tenant.plan,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      },
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}