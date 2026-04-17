import { Module } from '@nestjs/common';
import { NewsBannerController } from './news-banner.controller';
import { NewsBannerService } from './news-banner.service';

@Module({
  controllers: [NewsBannerController],
  providers: [NewsBannerService],
})
export class NewsBannerModule {}
