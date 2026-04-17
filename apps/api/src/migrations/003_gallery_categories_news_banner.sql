-- Gallery categories table
CREATE TABLE gallery_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  position    INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gallery_categories_position ON gallery_categories(position);

-- Create a default category for existing gallery items
INSERT INTO gallery_categories (id, name, slug, position)
VALUES ('00000000-0000-0000-0000-000000000001', 'Avant / Après', 'avant-apres', 0);

-- Gallery item type enum
CREATE TYPE gallery_item_type AS ENUM ('single', 'before_after');

-- Add category_id and type to gallery_items
ALTER TABLE gallery_items ADD COLUMN category_id UUID REFERENCES gallery_categories(id) ON DELETE CASCADE;
ALTER TABLE gallery_items ADD COLUMN type gallery_item_type NOT NULL DEFAULT 'before_after';

-- Make after_image nullable (for single type items)
ALTER TABLE gallery_items ALTER COLUMN after_image DROP NOT NULL;

-- Assign existing items to the default category
UPDATE gallery_items SET category_id = '00000000-0000-0000-0000-000000000001' WHERE category_id IS NULL;

-- Now make category_id NOT NULL
ALTER TABLE gallery_items ALTER COLUMN category_id SET NOT NULL;

-- Replace old position index with category-aware index
DROP INDEX IF EXISTS idx_gallery_items_position;
CREATE INDEX idx_gallery_items_category ON gallery_items(category_id, position);

-- News banner table
CREATE TYPE news_banner_type AS ENUM ('info', 'promo', 'event');

CREATE TABLE news_banner (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text        VARCHAR(500) NOT NULL,
  link        VARCHAR(500),
  type        news_banner_type NOT NULL DEFAULT 'info',
  is_active   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Only one active banner at a time
CREATE UNIQUE INDEX idx_news_banner_active
  ON news_banner(is_active) WHERE is_active = true;
