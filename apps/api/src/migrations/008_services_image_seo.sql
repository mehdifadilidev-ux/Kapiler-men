-- Add SEO-friendly alt + title attributes to service images
ALTER TABLE services ADD COLUMN image_alt VARCHAR(255);
ALTER TABLE services ADD COLUMN image_title VARCHAR(255);
