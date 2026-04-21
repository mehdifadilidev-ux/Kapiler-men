-- Add optional section label to services for grouping on the public page
ALTER TABLE services ADD COLUMN section VARCHAR(255);
