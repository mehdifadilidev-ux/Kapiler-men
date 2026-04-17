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
import { GalleryCategoriesService, type GalleryCategoryResponse } from './gallery-categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  createGalleryCategorySchema,
  updateGalleryCategorySchema,
  reorderGalleryCategoriesSchema,
} from '@kpil/shared';

@Controller()
export class GalleryCategoriesController {
  constructor(private categoriesService: GalleryCategoriesService) {}

  // Public: list categories
  @Get('gallery/categories')
  findAll(): Promise<GalleryCategoryResponse[]> {
    return this.categoriesService.findAll();
  }

  // Admin: create
  @Post('admin/gallery/categories')
  @UseGuards(JwtAuthGuard)
  create(@Body() body: unknown): Promise<GalleryCategoryResponse> {
    const dto = createGalleryCategorySchema.parse(body);
    return this.categoriesService.create(dto);
  }

  // Admin: update
  @Put('admin/gallery/categories/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<GalleryCategoryResponse> {
    const dto = updateGalleryCategorySchema.parse(body);
    return this.categoriesService.update(id, dto);
  }

  // Admin: delete (cascades to gallery items)
  @Delete('admin/gallery/categories/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.categoriesService.remove(id);
  }

  // Admin: reorder
  @Patch('admin/gallery/categories/order')
  @UseGuards(JwtAuthGuard)
  reorder(@Body() body: unknown): Promise<void> {
    const dto = reorderGalleryCategoriesSchema.parse(body);
    return this.categoriesService.reorder(dto);
  }
}
