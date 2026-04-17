import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type { CreateGalleryCategoryDto, UpdateGalleryCategoryDto, ReorderGalleryCategoriesDto } from '@kpil/shared';

interface GalleryCategoryRow {
  id: string;
  name: string;
  slug: string;
  position: number;
  created_at: Date;
  updated_at: Date;
}

export interface GalleryCategoryResponse {
  id: string;
  name: string;
  slug: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

function toResponse(row: GalleryCategoryRow): GalleryCategoryResponse {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    position: row.position,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

@Injectable()
export class GalleryCategoriesService {
  constructor(private db: DatabaseService) {}

  async findAll(): Promise<GalleryCategoryResponse[]> {
    const rows = await this.db.sql<GalleryCategoryRow[]>`
      SELECT * FROM gallery_categories ORDER BY position ASC, created_at ASC
    `;
    return rows.map(toResponse);
  }

  async create(dto: CreateGalleryCategoryDto): Promise<GalleryCategoryResponse> {
    const [maxPos] = await this.db.sql<{ max: number | null }[]>`
      SELECT MAX(position) as max FROM gallery_categories
    `;
    const nextPosition = (maxPos?.max ?? -1) + 1;

    const [row] = await this.db.sql<GalleryCategoryRow[]>`
      INSERT INTO gallery_categories (name, slug, position)
      VALUES (${dto.name}, ${dto.slug}, ${nextPosition})
      RETURNING *
    `;

    if (!row) {
      throw new Error('Failed to create gallery category');
    }

    return toResponse(row);
  }

  async update(id: string, dto: UpdateGalleryCategoryDto): Promise<GalleryCategoryResponse> {
    const [existing] = await this.db.sql<GalleryCategoryRow[]>`
      SELECT * FROM gallery_categories WHERE id = ${id}
    `;

    if (!existing) {
      throw new NotFoundException('Gallery category not found');
    }

    const [row] = await this.db.sql<GalleryCategoryRow[]>`
      UPDATE gallery_categories SET
        name = ${dto.name ?? existing.name},
        slug = ${dto.slug ?? existing.slug},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!row) {
      throw new NotFoundException('Gallery category not found');
    }

    return toResponse(row);
  }

  async remove(id: string): Promise<void> {
    const result = await this.db.sql`
      DELETE FROM gallery_categories WHERE id = ${id}
    `;

    if (result.count === 0) {
      throw new NotFoundException('Gallery category not found');
    }
  }

  async reorder(dto: ReorderGalleryCategoriesDto): Promise<void> {
    await this.db.sql.begin(async (tx) => {
      for (const { id, position } of dto.items) {
        await tx`
          UPDATE gallery_categories SET position = ${position}, updated_at = NOW()
          WHERE id = ${id}
        `;
      }
    });
  }
}
