import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadService } from './upload.service';
import { signedUrlRequestSchema } from '@kpil/shared';

@Controller('admin/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('signed-url')
  async getSignedUrl(@Body() body: unknown) {
    const { filename, contentType } = signedUrlRequestSchema.parse(body);
    return this.uploadService.generateSignedUrl(filename, contentType);
  }
}
