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
import { GalleryService, type GalleryResponse } from './gallery.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { createGallerySchema, updateGallerySchema, reorderGallerySchema } from '@kpil/shared';

@Controller()
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  // Public routes
  @Get('gallery')
  findAll(): Promise<GalleryResponse[]> {
    return this.galleryService.findAll();
  }

  @Get('gallery/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<GalleryResponse> {
    return this.galleryService.findOne(id);
  }

  // Admin routes
  @Post('admin/gallery')
  @UseGuards(JwtAuthGuard)
  create(@Body() body: unknown): Promise<GalleryResponse> {
    const dto = createGallerySchema.parse(body);
    return this.galleryService.create(dto);
  }

  @Put('admin/gallery/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() body: unknown): Promise<GalleryResponse> {
    const dto = updateGallerySchema.parse(body);
    return this.galleryService.update(id, dto);
  }

  @Delete('admin/gallery/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.galleryService.remove(id);
  }

  @Patch('admin/gallery/order')
  @UseGuards(JwtAuthGuard)
  reorder(@Body() body: unknown): Promise<void> {
    const dto = reorderGallerySchema.parse(body);
    return this.galleryService.reorder(dto);
  }
}
