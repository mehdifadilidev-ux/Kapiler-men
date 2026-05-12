import { Module } from '@nestjs/common';
import { PartnerBrandsController } from './partner-brands.controller';
import { PartnerBrandsService } from './partner-brands.service';

@Module({
  controllers: [PartnerBrandsController],
  providers: [PartnerBrandsService],
})
export class PartnerBrandsModule {}
