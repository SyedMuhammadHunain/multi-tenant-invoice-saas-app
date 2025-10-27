import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth.response';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { User } from './schemas/user.schema';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('registerInput') registerInput: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(registerInput);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@Context() context): Promise<User> {
    return context.req.user;
  }
}