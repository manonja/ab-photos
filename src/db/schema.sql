-- D1 Schema for ab-photos
-- Apply with: wrangler d1 execute ab-photos --remote --file=src/db/schema.sql

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  isPublished INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  desktop_blob TEXT NOT NULL,
  mobile_blob TEXT NOT NULL,
  gallery_blob TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  caption TEXT,
  project_id TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Anton Bossenbroek',
  excerpt TEXT,
  featuredImage TEXT,
  tags TEXT NOT NULL DEFAULT '[]',
  published INTEGER NOT NULL DEFAULT 0,
  layout TEXT NOT NULL DEFAULT 'single',
  content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS exhibits (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  featuredImage TEXT NOT NULL,
  startDate TEXT NOT NULL,
  endDate TEXT NOT NULL,
  isActive INTEGER NOT NULL DEFAULT 0,
  link TEXT,
  isUpcoming INTEGER NOT NULL DEFAULT 0
);
