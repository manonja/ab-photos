export interface Photo {
    id: string;
    desktop_blob: string;
    mobile_blob: string;
    gallery_blob: string;
    sequence: number;
    caption?: string | null;
    projectId: string;
}

export interface Project {
    id: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    isPublished: boolean;
} 