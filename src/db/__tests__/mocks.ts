export const mockPhotos = [
  { id: 'photo1', projectId: 'nature', sequence: 1, url: '/photos/1.jpg' },
  { id: 'photo2', projectId: 'nature', sequence: 2, url: '/photos/2.jpg' },
  { id: 'photo3', projectId: 'urban', sequence: 1, url: '/photos/3.jpg' },
]

export const mockProjects = [
  { id: 'nature', title: 'Nature', isPublished: true },
  { id: 'urban', title: 'Urban', isPublished: true },
  { id: 'draft', title: 'Draft', isPublished: false },
]

export const mockNewsPosts = [
  {
    id: 'first-post',
    title: 'First Post',
    date: '2026-03-01',
    author: 'Anton Bossenbroek',
    excerpt: 'This is the first post',
    featuredImage: null,
    tags: '["photography", "travel"]',
    published: 1,
    layout: 'single',
    content: '<p>First post content</p>',
  },
  {
    id: 'second-post',
    title: 'Second Post',
    date: '2026-04-01',
    author: 'Guest Author',
    excerpt: 'This is the second post',
    featuredImage: '/images/post2.jpg',
    tags: '["photography"]',
    published: 1,
    layout: 'two-column',
    content: '<p>Second post content</p>',
  },
  {
    id: 'draft-post',
    title: 'Draft Post',
    date: '2026-05-01',
    author: 'Anton Bossenbroek',
    excerpt: 'This is a draft',
    featuredImage: null,
    tags: '[]',
    published: 0,
    layout: 'single',
    content: '<p>Draft content</p>',
  },
]
