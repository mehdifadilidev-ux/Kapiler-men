import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UploadService } from '../upload/upload.service';
import type { CreateGalleryDto, UpdateGalleryDto, ReorderGalleryDto } from '@kpil/shared';

interface GalleryRow {
  id: string;
  category_id: string;
  type: 'single' | 'before_after';
  title: string;
  description: string | null;
  before_image: string;
  after_image: string | null;
  position: number;
  created_at: Date;
  updated_at: Date;
}

export interface GalleryResponse {
  id: string;
  categoryId: string;
  type: 'single' | 'before_after';
  title: string;
  description: string | null;
  beforeImage: string;
  afterImage: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

function toResponse(row: GalleryRow): GalleryResponse {
  return {
    id: row.id,
    categoryId: row.category_id,
    type: row.type,
    title: row.title,
    description: row.description,
    beforeImage: row.before_image,
    afterImage: row.after_image,
    position: row.position,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

@Injectable()
export class GalleryService {
  constructor(
    private db: DatabaseService,
    private uploadService: UploadService,
  ) {}

  async findAll(categorySlug?: string): Promise<GalleryResponse[]> {
    if (categorySlug) {
      const rows = await this.db.sql<GalleryRow[]>`
        SELECT gi.* FROM gallery_items gi
        JOIN gallery_categories gc ON gc.id = gi.category_id
        WHERE gc.slug = ${categorySlug}
        ORDER BY gi.position ASC, gi.created_at DESC
      `;
      return rows.map(toResponse);
    }

    const rows = await this.db.sql<GalleryRow[]>`
      SELECT * FROM gallery_items ORDER BY position ASC, created_at DESC
    `;
    return rows.map(toResponse);
  }

  async findOne(id: string): Promise<GalleryResponse> {
    const [item] = await this.db.sql<GalleryRow[]>`
      SELECT * FROM gallery_items WHERE id = ${id}
    `;

    if (!item) {
      throw new NotFoundException('Gallery item not found');
    }

    return toResponse(item);
  }

  async create(dto: CreateGalleryDto): Promise<GalleryResponse> {
    const [maxPos] = await this.db.sql<{ max: number | null }[]>`
      SELECT MAX(position) as max FROM gallery_items WHERE category_id = ${dto.categoryId}
    `;
    const nextPosition = (maxPos?.max ?? -1) + 1;

    const [item] = await this.db.sql<GalleryRow[]>`
      INSERT INTO gallery_items (category_id, type, title, description, before_image, after_image, position)
      VALUES (
        ${dto.categoryId},
        ${dto.type ?? 'before_after'},
        ${dto.title},
        ${dto.description ?? null},
        ${dto.beforeImage},
        ${dto.afterImage ?? null},
        ${nextPosition}
      )
      RETURNING *
    `;

    if (!item) {
      throw new Error('Failed to create gallery item');
    }

    return toResponse(item);
  }

  async update(id: string, dto: UpdateGalleryDto): Promise<GalleryResponse> {
    const [existing] = await this.db.sql<GalleryRow[]>`
      SELECT * FROM gallery_items WHERE id = ${id}
    `;

    if (!existing) {
      throw new NotFoundException('Gallery item not found');
    }

    const [item] = await this.db.sql<GalleryRow[]>`
      UPDATE gallery_items SET
        category_id = ${dto.categoryId ?? existing.category_id},
        type = ${dto.type ?? existing.type},
        title = ${dto.title ?? existing.title},
        description = ${dto.description ?? existing.description},
        before_image = ${dto.beforeImage ?? existing.before_image},
        after_image = ${dto.afterImage ?? existing.after_image},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!item) {
      throw new NotFoundException('Gallery item not found');
    }

    return toResponse(item);
  }

  async remove(id: string): Promise<void> {
    const [item] = await this.db.sql<GalleryRow[]>`
      SELECT * FROM gallery_items WHERE id = ${id}
    `;

    if (!item) {
      throw new NotFoundException('Gallery item not found');
    }

    await this.uploadService.deleteFile(this.extractFilePath(item.before_image));
    if (item.after_image) {
      await this.uploadService.deleteFile(this.extractFilePath(item.after_image));
    }

    await this.db.sql`DELETE FROM gallery_items WHERE id = ${id}`;
  }

  async reorder(dto: ReorderGalleryDto): Promise<void> {
    await this.db.sql.begin(async (tx) => {
      for (const { id, position } of dto.items) {
        await tx`
          UPDATE gallery_items SET position = ${position}, updated_at = NOW()
          WHERE id = ${id}
        `;
      }
    });
  }

  private extractFilePath(publicUrl: string): string {
    const match = publicUrl.match(/\/o\/(.+?)\?/);
    const captured = match?.[1];
    return captured ? decodeURIComponent(captured) : '';
  }
}
