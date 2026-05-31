-- Add SEO-friendly alt + title attributes to gallery item images
ALTER TABLE gallery_items ADD COLUMN image_alt VARCHAR(255);
ALTER TABLE gallery_items ADD COLUMN image_title VARCHAR(255);
