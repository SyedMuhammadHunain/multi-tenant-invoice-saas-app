import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  @Mutation(() => String)
  async uploadLogo(
    @Args('file') file: string,
    @Context() context,
  ): Promise<string> {
    const tenantId = context.req.user.tenantId;
    return this.uploadService.uploadLogo(file, tenantId);
  }
}