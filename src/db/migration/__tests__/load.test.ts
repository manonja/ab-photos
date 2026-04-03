import type { D1Photo, D1Project } from '../transform'
import {
  generateMigrationSql,
  generatePhotoInsert,
  generateProjectInsert,
} from '../load'

describe('generateProjectInsert', () => {
  it('should generate valid INSERT for a published project', () => {
    const project: D1Project = {
      id: 'nature',
      title: 'Nature',
      subtitle: 'Landscapes',
      description: 'Photos of nature',
      isPublished: 1,
    }

    const sql = generateProjectInsert(project)

    expect(sql).toBe(
      "INSERT OR REPLACE INTO projects (id, title, subtitle, description, isPublished) VALUES ('nature', 'Nature', 'Landscapes', 'Photos of nature', 1);",
    )
  })

  it('should output NULL for null fields', () => {
    const project: D1Project = {
      id: 'minimal',
      title: 'Minimal',
      subtitle: null,
      description: null,
      isPublished: 0,
    }

    const sql = generateProjectInsert(project)

    expect(sql).toContain('NULL, NULL, 0')
  })

  it('should escape single quotes in text values', () => {
    const project: D1Project = {
      id: "it's-test",
      title: "Anton's Photos",
      subtitle: null,
      description: "A project with 'quotes'",
      isPublished: 1,
    }

    const sql = generateProjectInsert(project)

    expect(sql).toContain("'it''s-test'")
    expect(sql).toContain("'Anton''s Photos'")
    expect(sql).toContain("'A project with ''quotes'''")
  })
})

describe('generatePhotoInsert', () => {
  it('should generate valid INSERT for a photo', () => {
    const photo: D1Photo = {
      id: 'photo-1',
      desktop_blob: '/img/desktop.jpg',
      mobile_blob: '/img/mobile.jpg',
      gallery_blob: '/img/gallery.jpg',
      sequence: 1,
      caption: 'Sunset',
      project_id: 'nature',
    }

    const sql = generatePhotoInsert(photo)

    expect(sql).toBe(
      "INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('photo-1', '/img/desktop.jpg', '/img/mobile.jpg', '/img/gallery.jpg', 1, 'Sunset', 'nature');",
    )
  })

  it('should output NULL for null caption', () => {
    const photo: D1Photo = {
      id: 'photo-2',
      desktop_blob: '/d.jpg',
      mobile_blob: '/m.jpg',
      gallery_blob: '/g.jpg',
      sequence: 2,
      caption: null,
      project_id: 'urban',
    }

    const sql = generatePhotoInsert(photo)

    expect(sql).toContain(', NULL,')
  })
})

describe('generateMigrationSql', () => {
  it('should generate complete SQL with header comments', () => {
    const projects: D1Project[] = [
      { id: 'p1', title: 'Project 1', subtitle: null, description: null, isPublished: 1 },
    ]
    const photos: D1Photo[] = [
      {
        id: 'ph1',
        desktop_blob: '/d.jpg',
        mobile_blob: '/m.jpg',
        gallery_blob: '/g.jpg',
        sequence: 1,
        caption: null,
        project_id: 'p1',
      },
    ]

    const sql = generateMigrationSql(projects, photos)

    expect(sql).toContain('-- Auto-generated migration data')
    expect(sql).toContain('-- Projects: 1, Photos: 1')
    expect(sql).toContain('-- Projects')
    expect(sql).toContain('-- Photos')
    expect(sql).toContain("INSERT OR REPLACE INTO projects")
    expect(sql).toContain("INSERT OR REPLACE INTO photos")
  })

  it('should produce no INSERT statements for empty arrays', () => {
    const sql = generateMigrationSql([], [])

    expect(sql).toContain('-- Projects: 0, Photos: 0')
    expect(sql).not.toContain('INSERT')
  })

  it('should include all projects and photos', () => {
    const projects: D1Project[] = [
      { id: 'p1', title: 'A', subtitle: null, description: null, isPublished: 1 },
      { id: 'p2', title: 'B', subtitle: null, description: null, isPublished: 0 },
    ]
    const photos: D1Photo[] = [
      { id: 'ph1', desktop_blob: '/d1.jpg', mobile_blob: '/m1.jpg', gallery_blob: '/g1.jpg', sequence: 1, caption: null, project_id: 'p1' },
      { id: 'ph2', desktop_blob: '/d2.jpg', mobile_blob: '/m2.jpg', gallery_blob: '/g2.jpg', sequence: 2, caption: null, project_id: 'p1' },
      { id: 'ph3', desktop_blob: '/d3.jpg', mobile_blob: '/m3.jpg', gallery_blob: '/g3.jpg', sequence: 1, caption: null, project_id: 'p2' },
    ]

    const sql = generateMigrationSql(projects, photos)

    expect(sql).toContain('-- Projects: 2, Photos: 3')
    const insertCount = (sql.match(/INSERT OR REPLACE/g) || []).length
    expect(insertCount).toBe(5) // 2 projects + 3 photos
  })
})
