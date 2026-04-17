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
import { TestimonialsService, type TestimonialResponse } from './testimonials.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { createTestimonialSchema, updateTestimonialSchema, reorderTestimonialsSchema } from '@kpil/shared';

@Controller()
export class TestimonialsController {
  constructor(private testimonialsService: TestimonialsService) {}

  // Public: get visible testimonials
  @Get('testimonials')
  findVisible(): Promise<TestimonialResponse[]> {
    return this.testimonialsService.findVisible();
  }

  // Admin: list all testimonials
  @Get('admin/testimonials')
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<TestimonialResponse[]> {
    return this.testimonialsService.findAll();
  }

  // Admin: create
  @Post('admin/testimonials')
  @UseGuards(JwtAuthGuard)
  create(@Body() body: unknown): Promise<TestimonialResponse> {
    const dto = createTestimonialSchema.parse(body);
    return this.testimonialsService.create(dto);
  }

  // Admin: update
  @Put('admin/testimonials/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<TestimonialResponse> {
    const dto = updateTestimonialSchema.parse(body);
    return this.testimonialsService.update(id, dto);
  }

  // Admin: delete
  @Delete('admin/testimonials/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.testimonialsService.remove(id);
  }

  // Admin: toggle visibility
  @Patch('admin/testimonials/:id/visibility')
  @UseGuards(JwtAuthGuard)
  toggleVisibility(@Param('id', ParseUUIDPipe) id: string): Promise<TestimonialResponse> {
    return this.testimonialsService.toggleVisibility(id);
  }

  // Admin: reorder
  @Patch('admin/testimonials/order')
  @UseGuards(JwtAuthGuard)
  reorder(@Body() body: unknown): Promise<void> {
    const dto = reorderTestimonialsSchema.parse(body);
    return this.testimonialsService.reorder(dto);
  }
}
