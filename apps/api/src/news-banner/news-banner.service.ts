import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type { CreateNewsBannerDto, UpdateNewsBannerDto } from '@kpil/shared';

interface NewsBannerRow {
  id: string;
  text: string;
  link: string | null;
  type: 'info' | 'promo' | 'event';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface NewsBannerResponse {
  id: string;
  text: string;
  link: string | null;
  type: 'info' | 'promo' | 'event';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function toResponse(row: NewsBannerRow): NewsBannerResponse {
  return {
    id: row.id,
    text: row.text,
    link: row.link,
    type: row.type,
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

@Injectable()
export class NewsBannerService {
  constructor(private db: DatabaseService) {}

  async findActive(): Promise<NewsBannerResponse | null> {
    const [row] = await this.db.sql<NewsBannerRow[]>`
      SELECT * FROM news_banner WHERE is_active = true LIMIT 1
    `;
    return row ? toResponse(row) : null;
  }

  async findAll(): Promise<NewsBannerResponse[]> {
    const rows = await this.db.sql<NewsBannerRow[]>`
      SELECT * FROM news_banner ORDER BY created_at DESC
    `;
    return rows.map(toResponse);
  }

  async create(dto: CreateNewsBannerDto): Promise<NewsBannerResponse> {
    const [row] = await this.db.sql<NewsBannerRow[]>`
      INSERT INTO news_banner (text, link, type)
      VALUES (${dto.text}, ${dto.link ?? null}, ${dto.type ?? 'info'})
      RETURNING *
    `;

    if (!row) {
      throw new Error('Failed to create news banner');
    }

    return toResponse(row);
  }

  async update(id: string, dto: UpdateNewsBannerDto): Promise<NewsBannerResponse> {
    const [existing] = await this.db.sql<NewsBannerRow[]>`
      SELECT * FROM news_banner WHERE id = ${id}
    `;

    if (!existing) {
      throw new NotFoundException('News banner not found');
    }

    const [row] = await this.db.sql<NewsBannerRow[]>`
      UPDATE news_banner SET
        text = ${dto.text ?? existing.text},
        link = ${dto.link ?? existing.link},
        type = ${dto.type ?? existing.type},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!row) {
      throw new NotFoundException('News banner not found');
    }

    return toResponse(row);
  }

  async remove(id: string): Promise<void> {
    const result = await this.db.sql`
      DELETE FROM news_banner WHERE id = ${id}
    `;

    if (result.count === 0) {
      throw new NotFoundException('News banner not found');
    }
  }

  async activate(id: string): Promise<NewsBannerResponse> {
    const [existing] = await this.db.sql<NewsBannerRow[]>`
      SELECT * FROM news_banner WHERE id = ${id}
    `;

    if (!existing) {
      throw new NotFoundException('News banner not found');
    }

    // Deactivate all, then activate the target (within a transaction)
    const [row] = await this.db.sql.begin(async (tx) => {
      await tx`UPDATE news_banner SET is_active = false, updated_at = NOW() WHERE is_active = true`;
      return tx<NewsBannerRow[]>`
        UPDATE news_banner SET is_active = true, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    });

    if (!row) {
      throw new NotFoundException('News banner not found');
    }

    return toResponse(row);
  }
}
