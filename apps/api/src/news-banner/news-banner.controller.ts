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
import { NewsBannerService, type NewsBannerResponse } from './news-banner.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { createNewsBannerSchema, updateNewsBannerSchema } from '@kpil/shared';

@Controller()
export class NewsBannerController {
  constructor(private newsBannerService: NewsBannerService) {}

  // Public: get active banner
  @Get('news-banner')
  findActive(): Promise<NewsBannerResponse | null> {
    return this.newsBannerService.findActive();
  }

  // Admin: list all banners
  @Get('admin/news-banner')
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<NewsBannerResponse[]> {
    return this.newsBannerService.findAll();
  }

  // Admin: create
  @Post('admin/news-banner')
  @UseGuards(JwtAuthGuard)
  create(@Body() body: unknown): Promise<NewsBannerResponse> {
    const dto = createNewsBannerSchema.parse(body);
    return this.newsBannerService.create(dto);
  }

  // Admin: update
  @Put('admin/news-banner/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<NewsBannerResponse> {
    const dto = updateNewsBannerSchema.parse(body);
    return this.newsBannerService.update(id, dto);
  }

  // Admin: delete
  @Delete('admin/news-banner/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.newsBannerService.remove(id);
  }

  // Admin: activate (deactivates all others)
  @Patch('admin/news-banner/:id/activate')
  @UseGuards(JwtAuthGuard)
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<NewsBannerResponse> {
    return this.newsBannerService.activate(id);
  }
}
