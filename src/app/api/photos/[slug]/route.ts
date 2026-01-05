import { NextResponse } from 'next/server';
import { findPhotosByProjectId } from '@/db/operations';
import { DatabaseError } from '@/db/types';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const photos = await findPhotosByProjectId(slug);

        if (!photos.length) {
            return NextResponse.json(
                { error: 'No photos found for this project' },
                { status: 404 }
            );
        }

        return NextResponse.json(photos);
    } catch (error) {
        console.error('Error fetching photos:', error);
        const dbError = error as DatabaseError;
        return NextResponse.json(
            { error: 'Failed to fetch photos', code: dbError.code },
            { status: 500 }
        );
    }
}
