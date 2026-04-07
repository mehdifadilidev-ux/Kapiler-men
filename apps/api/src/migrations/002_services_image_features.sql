-- Add image and features to services
ALTER TABLE services ADD COLUMN image VARCHAR(500);
ALTER TABLE services ADD COLUMN features TEXT[] DEFAULT '{}';
