export interface GhostAuthor {
  id: string;
  name: string;
  slug: string;
  profile_image?: string;
  cover_image?: string;
  bio?: string;
  website?: string;
  location?: string;
  facebook?: string;
  twitter?: string;
  meta_title?: string;
  meta_description?: string;
  url: string;
}

export interface GhostTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  feature_image?: string;
  visibility: string;
  meta_title?: string;
  meta_description?: string;
  url: string;
}

export interface GhostPost {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  comment_id?: string;
  feature_image?: string;
  featured: boolean;
  visibility: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  custom_excerpt?: string;
  codeinjection_head?: string;
  codeinjection_foot?: string;
  custom_template?: string;
  canonical_url?: string;
  tags?: GhostTag[];
  authors?: GhostAuthor[];
  primary_author?: GhostAuthor;
  primary_tag?: GhostTag;
  url: string;
  excerpt: string;
  reading_time: number;
  access: boolean;
  comments: boolean;
  og_image?: string;
  og_title?: string;
  og_description?: string;
  twitter_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  meta_title?: string;
  meta_description?: string;
} 