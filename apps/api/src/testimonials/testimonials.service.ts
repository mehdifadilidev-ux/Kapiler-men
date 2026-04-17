import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type { CreateTestimonialDto, UpdateTestimonialDto, ReorderTestimonialsDto } from '@kpil/shared';

interface TestimonialRow {
  id: string;
  author: string;
  text: string;
  rating: number;
  source: 'google' | 'planity' | 'other';
  position: number;
  is_visible: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TestimonialResponse {
  id: string;
  author: string;
  text: string;
  rating: number;
  source: 'google' | 'planity' | 'other';
  position: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

function toResponse(row: TestimonialRow): TestimonialResponse {
  return {
    id: row.id,
    author: row.author,
    text: row.text,
    rating: row.rating,
    source: row.source,
    position: row.position,
    isVisible: row.is_visible,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

@Injectable()
export class TestimonialsService {
  constructor(private db: DatabaseService) {}

  async findVisible(): Promise<TestimonialResponse[]> {
    const rows = await this.db.sql<TestimonialRow[]>`
      SELECT * FROM testimonials WHERE is_visible = true ORDER BY position ASC, created_at DESC
    `;
    return rows.map(toResponse);
  }

  async findAll(): Promise<TestimonialResponse[]> {
    const rows = await this.db.sql<TestimonialRow[]>`
      SELECT * FROM testimonials ORDER BY position ASC, created_at DESC
    `;
    return rows.map(toResponse);
  }

  async create(dto: CreateTestimonialDto): Promise<TestimonialResponse> {
    const [maxPos] = await this.db.sql<[{ max: number | null }]>`
      SELECT MAX(position) as max FROM testimonials
    `;
    const nextPosition = (maxPos?.max ?? -1) + 1;

    const [row] = await this.db.sql<TestimonialRow[]>`
      INSERT INTO testimonials (author, text, rating, source, position)
      VALUES (${dto.author}, ${dto.text}, ${dto.rating}, ${dto.source ?? 'google'}, ${nextPosition})
      RETURNING *
    `;

    if (!row) {
      throw new Error('Failed to create testimonial');
    }

    return toResponse(row);
  }

  async update(id: string, dto: UpdateTestimonialDto): Promise<TestimonialResponse> {
    const [existing] = await this.db.sql<TestimonialRow[]>`
      SELECT * FROM testimonials WHERE id = ${id}
    `;

    if (!existing) {
      throw new NotFoundException('Testimonial not found');
    }

    const [row] = await this.db.sql<TestimonialRow[]>`
      UPDATE testimonials SET
        author = ${dto.author ?? existing.author},
        text = ${dto.text ?? existing.text},
        rating = ${dto.rating ?? existing.rating},
        source = ${dto.source ?? existing.source},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!row) {
      throw new NotFoundException('Testimonial not found');
    }

    return toResponse(row);
  }

  async remove(id: string): Promise<void> {
    const result = await this.db.sql`
      DELETE FROM testimonials WHERE id = ${id}
    `;

    if (result.count === 0) {
      throw new NotFoundException('Testimonial not found');
    }
  }

  async toggleVisibility(id: string): Promise<TestimonialResponse> {
    const [row] = await this.db.sql<TestimonialRow[]>`
      UPDATE testimonials SET is_visible = NOT is_visible, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!row) {
      throw new NotFoundException('Testimonial not found');
    }

    return toResponse(row);
  }

  async reorder(dto: ReorderTestimonialsDto): Promise<void> {
    await this.db.sql.begin(async (tx) => {
      for (let i = 0; i < dto.ids.length; i++) {
        const id = dto.ids[i];
        if (id) {
          await tx`
            UPDATE testimonials SET position = ${i}, updated_at = NOW()
            WHERE id = ${id}
          `;
        }
      }
    });
  }
}
