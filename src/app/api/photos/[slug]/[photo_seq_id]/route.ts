import { NextResponse } from 'next/server';
import { findPhotoByProjectIdAndSeq } from '@/db/operations';
import { DatabaseError } from '@/db/types';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string; photo_seq_id: string }> }
) {
    const { slug, photo_seq_id } = await params;
    console.log('[API] getPhoto: Starting request', { slug, photo_seq_id });

    try {
        const sequence = parseInt(photo_seq_id, 10);

        if (isNaN(sequence)) {
            console.warn('[API] getPhoto: Invalid sequence ID', { photo_seq_id });
            return NextResponse.json(
                { error: 'Invalid sequence ID' },
                { status: 400 }
            );
        }

        console.log('[API] getPhoto: Fetching photo', { projectId: slug, sequence });

        const photo = await findPhotoByProjectIdAndSeq(slug, sequence);

        if (!photo) {
            console.warn('[API] getPhoto: Photo not found', { projectId: slug, sequence });
            return NextResponse.json(
                { error: 'Photo not found' },
                { status: 404 }
            );
        }

        console.log('[API] getPhoto: Successfully retrieved photo', {
            projectId: slug,
            sequence,
            photoId: photo.id
        });

        return NextResponse.json(photo);
    } catch (error) {
        console.error('[API] getPhoto: Error occurred', {
            error,
            slug,
            photo_seq_id,
            errorCode: (error as DatabaseError).code
        });
        const dbError = error as DatabaseError;
        return NextResponse.json(
            { error: 'Failed to fetch photo', code: dbError.code },
            { status: 500 }
        );
    }
}
