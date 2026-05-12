import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type {
  CreatePartnerBrandDto,
  UpdatePartnerBrandDto,
  ReorderPartnerBrandsDto,
} from '@kpil/shared';

interface PartnerBrandRow {
  id: string;
  name: string;
  logo: string;
  website: string | null;
  position: number;
  is_visible: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PartnerBrandResponse {
  id: string;
  name: string;
  logo: string;
  website: string | null;
  position: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

function toResponse(row: PartnerBrandRow): PartnerBrandResponse {
  return {
    id: row.id,
    name: row.name,
    logo: row.logo,
    website: row.website,
    position: row.position,
    isVisible: row.is_visible,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

@Injectable()
export class PartnerBrandsService {
  constructor(private db: DatabaseService) {}

  async findVisible(): Promise<PartnerBrandResponse[]> {
    const rows = await this.db.sql<PartnerBrandRow[]>`
      SELECT * FROM partner_brands WHERE is_visible = true ORDER BY position ASC, created_at DESC
    `;
    return rows.map(toResponse);
  }

  async findAll(): Promise<PartnerBrandResponse[]> {
    const rows = await this.db.sql<PartnerBrandRow[]>`
      SELECT * FROM partner_brands ORDER BY position ASC, created_at DESC
    `;
    return rows.map(toResponse);
  }

  async create(dto: CreatePartnerBrandDto): Promise<PartnerBrandResponse> {
    const [maxPos] = await this.db.sql<[{ max: number | null }]>`
      SELECT MAX(position) as max FROM partner_brands
    `;
    const nextPosition = (maxPos?.max ?? -1) + 1;

    const [row] = await this.db.sql<PartnerBrandRow[]>`
      INSERT INTO partner_brands (name, logo, website, position)
      VALUES (${dto.name}, ${dto.logo}, ${dto.website ?? null}, ${nextPosition})
      RETURNING *
    `;

    if (!row) {
      throw new Error('Failed to create partner brand');
    }

    return toResponse(row);
  }

  async update(id: string, dto: UpdatePartnerBrandDto): Promise<PartnerBrandResponse> {
    const [existing] = await this.db.sql<PartnerBrandRow[]>`
      SELECT * FROM partner_brands WHERE id = ${id}
    `;

    if (!existing) {
      throw new NotFoundException('Partner brand not found');
    }

    const [row] = await this.db.sql<PartnerBrandRow[]>`
      UPDATE partner_brands SET
        name = ${dto.name ?? existing.name},
        logo = ${dto.logo ?? existing.logo},
        website = ${dto.website ?? existing.website},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!row) {
      throw new NotFoundException('Partner brand not found');
    }

    return toResponse(row);
  }

  async remove(id: string): Promise<void> {
    const result = await this.db.sql`
      DELETE FROM partner_brands WHERE id = ${id}
    `;

    if (result.count === 0) {
      throw new NotFoundException('Partner brand not found');
    }
  }

  async toggleVisibility(id: string): Promise<PartnerBrandResponse> {
    const [row] = await this.db.sql<PartnerBrandRow[]>`
      UPDATE partner_brands SET is_visible = NOT is_visible, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!row) {
      throw new NotFoundException('Partner brand not found');
    }

    return toResponse(row);
  }

  async reorder(dto: ReorderPartnerBrandsDto): Promise<void> {
    await this.db.sql.begin(async (tx) => {
      for (let i = 0; i < dto.ids.length; i++) {
        const id = dto.ids[i];
        if (id) {
          await tx`
            UPDATE partner_brands SET position = ${i}, updated_at = NOW()
            WHERE id = ${id}
          `;
        }
      }
    });
  }
}
