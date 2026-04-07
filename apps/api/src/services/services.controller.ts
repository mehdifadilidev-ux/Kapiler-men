import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ServicesService, type ServiceResponse } from './services.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { createServiceSchema, updateServiceSchema } from '@kpil/shared';

@Controller()
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  // Public routes
  @Get('services')
  findAllPublic(): Promise<ServiceResponse[]> {
    return this.servicesService.findAllPublic();
  }

  @Get('services/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ServiceResponse> {
    return this.servicesService.findOne(id);
  }

  // Admin routes
  @Post('admin/services')
  @UseGuards(JwtAuthGuard)
  create(@Body() body: unknown): Promise<ServiceResponse> {
    const dto = createServiceSchema.parse(body);
    return this.servicesService.create(dto);
  }

  @Put('admin/services/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() body: unknown): Promise<ServiceResponse> {
    const dto = updateServiceSchema.parse(body);
    return this.servicesService.update(id, dto);
  }

  @Delete('admin/services/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.servicesService.remove(id);
  }
}
