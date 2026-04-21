-- Make category_id optional on gallery_items (categories removed from UI)
ALTER TABLE gallery_items ALTER COLUMN category_id DROP NOT NULL;
