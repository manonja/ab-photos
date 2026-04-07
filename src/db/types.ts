export interface Photo {
  id: string
  desktop_blob: string
  mobile_blob: string
  gallery_blob: string
  sequence: number
  caption: string | null
  projectId: string
}

export interface Project {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  isPublished: boolean
}

export type { Exhibit } from '@/types/exhibit'

export interface DatabaseError extends Error {
  code?: string
  query?: string
  params?: unknown[]
  detail?: string
  hint?: string
  position?: string
  internalQuery?: string
  where?: string
  schema?: string
  table?: string
  column?: string
  dataType?: string
  constraint?: string
}
