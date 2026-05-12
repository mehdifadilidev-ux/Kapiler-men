import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PartnerBrandsService, type PartnerBrandResponse } from './partner-brands.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  createPartnerBrandSchema,
  updatePartnerBrandSchema,
  reorderPartnerBrandsSchema,
} from '@kpil/shared';

@Controller()
export class PartnerBrandsController {
  constructor(private partnerBrandsService: PartnerBrandsService) {}

  // Public: get visible partner brands
  @Get('partner-brands')
  findVisible(): Promise<PartnerBrandResponse[]> {
    return this.partnerBrandsService.findVisible();
  }

  // Admin: list all
  @Get('admin/partner-brands')
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<PartnerBrandResponse[]> {
    return this.partnerBrandsService.findAll();
  }

  // Admin: create
  @Post('admin/partner-brands')
  @UseGuards(JwtAuthGuard)
  create(@Body() body: unknown): Promise<PartnerBrandResponse> {
    const dto = createPartnerBrandSchema.parse(body);
    return this.partnerBrandsService.create(dto);
  }

  // Admin: update
  @Put('admin/partner-brands/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<PartnerBrandResponse> {
    const dto = updatePartnerBrandSchema.parse(body);
    return this.partnerBrandsService.update(id, dto);
  }

  // Admin: delete
  @Delete('admin/partner-brands/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.partnerBrandsService.remove(id);
  }

  // Admin: toggle visibility
  @Patch('admin/partner-brands/:id/visibility')
  @UseGuards(JwtAuthGuard)
  toggleVisibility(@Param('id', ParseUUIDPipe) id: string): Promise<PartnerBrandResponse> {
    return this.partnerBrandsService.toggleVisibility(id);
  }

  // Admin: reorder
  @Patch('admin/partner-brands/order')
  @UseGuards(JwtAuthGuard)
  reorder(@Body() body: unknown): Promise<void> {
    const dto = reorderPartnerBrandsSchema.parse(body);
    return this.partnerBrandsService.reorder(dto);
  }
}
