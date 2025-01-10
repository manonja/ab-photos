import { Photo, Project } from '../types';

export const mockProjects: Project[] = [
    {
        id: 'nature',
        title: 'Nature Photography',
        subtitle: 'Beautiful landscapes',
        description: 'A collection of nature photos',
        isPublished: true
    },
    {
        id: 'urban',
        title: 'Urban Photography',
        subtitle: 'City life',
        description: 'A collection of urban photos',
        isPublished: false
    }
];

export const mockPhotos: Photo[] = [
    {
        id: 'photo1',
        desktop_blob: 'https://example.com/photo1-desktop.jpg',
        mobile_blob: 'https://example.com/photo1-mobile.jpg',
        gallery_blob: 'https://example.com/photo1-gallery.jpg',
        sequence: 1,
        caption: 'Beautiful sunset',
        projectId: 'nature'
    },
    {
        id: 'photo2',
        desktop_blob: 'https://example.com/photo2-desktop.jpg',
        mobile_blob: 'https://example.com/photo2-mobile.jpg',
        gallery_blob: 'https://example.com/photo2-gallery.jpg',
        sequence: 2,
        caption: 'Mountain lake',
        projectId: 'nature'
    }
]; 