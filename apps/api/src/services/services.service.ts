import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type { CreateServiceDto, UpdateServiceDto } from '@kpil/shared';

interface ServiceRow {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  features: string[];
  duration: string | null;
  price: string | null;
  section: string | null;
  is_active: boolean;
  position: number;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceResponse {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  features: string[];
  duration: string | null;
  price: string | null;
  section: string | null;
  isActive: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

function toResponse(row: ServiceRow): ServiceResponse {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    features: row.features ?? [],
    duration: row.duration,
    price: row.price,
    section: row.section,
    isActive: row.is_active,
    position: row.position,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

@Injectable()
export class ServicesService {
  constructor(private db: DatabaseService) {}

  async findAllPublic(): Promise<ServiceResponse[]> {
    const rows = await this.db.sql<ServiceRow[]>`
      SELECT * FROM services WHERE is_active = true ORDER BY position ASC
    `;
    return rows.map(toResponse);
  }

  async findAll(): Promise<ServiceResponse[]> {
    const rows = await this.db.sql<ServiceRow[]>`
      SELECT * FROM services ORDER BY position ASC
    `;
    return rows.map(toResponse);
  }

  async findOne(id: string): Promise<ServiceResponse> {
    const [item] = await this.db.sql<ServiceRow[]>`
      SELECT * FROM services WHERE id = ${id}
    `;

    if (!item) {
      throw new NotFoundException('Service not found');
    }

    return toResponse(item);
  }

  async create(dto: CreateServiceDto): Promise<ServiceResponse> {
    const [maxPos] = await this.db.sql<{ max: number | null }[]>`
      SELECT MAX(position) as max FROM services
    `;
    const nextPosition = (maxPos?.max ?? -1) + 1;

    const [item] = await this.db.sql<ServiceRow[]>`
      INSERT INTO services (title, description, image, features, duration, price, section, is_active, position)
      VALUES (
        ${dto.title},
        ${dto.description ?? null},
        ${dto.image ?? null},
        ${dto.features ?? []},
        ${dto.duration ?? null},
        ${dto.price ?? null},
        ${dto.section ?? null},
        ${dto.isActive ?? true},
        ${nextPosition}
      )
      RETURNING *
    `;

    if (!item) {
      throw new Error('Failed to create service');
    }

    return toResponse(item);
  }

  async update(id: string, dto: UpdateServiceDto): Promise<ServiceResponse> {
    const [existing] = await this.db.sql<ServiceRow[]>`
      SELECT * FROM services WHERE id = ${id}
    `;

    if (!existing) {
      throw new NotFoundException('Service not found');
    }

    const [item] = await this.db.sql<ServiceRow[]>`
      UPDATE services SET
        title = ${dto.title ?? existing.title},
        description = ${dto.description ?? existing.description},
        image = ${dto.image ?? existing.image},
        features = ${dto.features ?? existing.features},
        duration = ${dto.duration ?? existing.duration},
        price = ${dto.price ?? existing.price},
        section = ${dto.section ?? existing.section},
        is_active = ${dto.isActive ?? existing.is_active},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!item) {
      throw new NotFoundException('Service not found');
    }

    return toResponse(item);
  }

  async remove(id: string): Promise<void> {
    const result = await this.db.sql`
      DELETE FROM services WHERE id = ${id}
    `;

    if (result.count === 0) {
      throw new NotFoundException('Service not found');
    }
  }
}
