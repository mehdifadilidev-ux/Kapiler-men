-- Migration 004: Testimonials table
CREATE TABLE testimonials (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author     VARCHAR(100) NOT NULL,
  text       VARCHAR(1000) NOT NULL,
  rating     SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  source     VARCHAR(20) NOT NULL DEFAULT 'google' CHECK (source IN ('google', 'planity', 'other')),
  position   INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
