import { NextResponse } from 'next/server';
import { findPhotoByProjectIdAndSeq } from '@/db/operations';
import { DatabaseError } from '@/db/types';

export const runtime = 'edge';

export async function GET(
    request: Request,
    { params }: { params: { slug: string; photo_seq_id: string } }
) {
    console.log('[API] getPhoto: Starting request', { params });

    try {
        const sequence = parseInt(params.photo_seq_id, 10);
        
        if (isNaN(sequence)) {
            console.warn('[API] getPhoto: Invalid sequence ID', { 
                photo_seq_id: params.photo_seq_id 
            });
            return NextResponse.json(
                { error: 'Invalid sequence ID' },
                { status: 400 }
            );
        }

        console.log('[API] getPhoto: Fetching photo', { 
            projectId: params.slug, 
            sequence 
        });

        const photo = await findPhotoByProjectIdAndSeq(params.slug, sequence);
        
        if (!photo) {
            console.warn('[API] getPhoto: Photo not found', {
                projectId: params.slug,
                sequence
            });
            return NextResponse.json(
                { error: 'Photo not found' },
                { status: 404 }
            );
        }

        console.log('[API] getPhoto: Successfully retrieved photo', {
            projectId: params.slug,
            sequence,
            photoId: photo.id
        });

        return NextResponse.json(photo);
    } catch (error) {
        console.error('[API] getPhoto: Error occurred', {
            error,
            params,
            errorCode: (error as DatabaseError).code
        });
        const dbError = error as DatabaseError;
        return NextResponse.json(
            { error: 'Failed to fetch photo', code: dbError.code },
            { status: 500 }
        );
    }
} 