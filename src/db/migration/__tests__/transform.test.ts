import type { PgPhoto, PgProject } from '../transform'
import { transformPhoto, transformProject } from '../transform'

describe('transformProject', () => {
  it('should convert a published project with all fields', () => {
    const pg: PgProject = {
      id: 'nature',
      title: 'Nature',
      subtitle: 'Landscapes and wildlife',
      description: 'A collection of nature photos',
      isPublished: true,
    }

    const result = transformProject(pg)

    expect(result).toEqual({
      id: 'nature',
      title: 'Nature',
      subtitle: 'Landscapes and wildlife',
      description: 'A collection of nature photos',
      isPublished: 1,
    })
  })

  it('should convert isPublished false to 0', () => {
    const pg: PgProject = {
      id: 'draft',
      title: 'Draft',
      subtitle: null,
      description: null,
      isPublished: false,
    }

    const result = transformProject(pg)

    expect(result.isPublished).toBe(0)
  })

  it('should preserve null optional fields', () => {
    const pg: PgProject = {
      id: 'minimal',
      title: 'Minimal',
      subtitle: null,
      description: null,
      isPublished: true,
    }

    const result = transformProject(pg)

    expect(result.subtitle).toBeNull()
    expect(result.description).toBeNull()
  })

  it('should handle empty strings', () => {
    const pg: PgProject = {
      id: 'empty',
      title: 'Empty',
      subtitle: '',
      description: '',
      isPublished: false,
    }

    const result = transformProject(pg)

    expect(result.subtitle).toBe('')
    expect(result.description).toBe('')
  })
})

describe('transformPhoto', () => {
  it('should pass through photo fields unchanged', () => {
    const pg: PgPhoto = {
      id: 'photo-1',
      desktop_blob: 'https://example.com/desktop.jpg',
      mobile_blob: 'https://example.com/mobile.jpg',
      gallery_blob: 'https://example.com/gallery.jpg',
      sequence: 1,
      caption: 'A beautiful sunset',
      project_id: 'nature',
    }

    const result = transformPhoto(pg)

    expect(result).toEqual({
      id: 'photo-1',
      desktop_blob: 'https://example.com/desktop.jpg',
      mobile_blob: 'https://example.com/mobile.jpg',
      gallery_blob: 'https://example.com/gallery.jpg',
      sequence: 1,
      caption: 'A beautiful sunset',
      project_id: 'nature',
    })
  })

  it('should preserve null caption', () => {
    const pg: PgPhoto = {
      id: 'photo-2',
      desktop_blob: '/img/d.jpg',
      mobile_blob: '/img/m.jpg',
      gallery_blob: '/img/g.jpg',
      sequence: 3,
      caption: null,
      project_id: 'urban',
    }

    const result = transformPhoto(pg)

    expect(result.caption).toBeNull()
  })
})
