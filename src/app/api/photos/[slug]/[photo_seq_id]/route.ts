import { NextResponse } from 'next/server';
import { findPhotoByProjectIdAndSeq } from '@/db/operations';
import { DatabaseError } from '@/db/types';
import { log } from '@/lib/logger';

export const runtime = 'edge';

export async function GET(
    request: Request,
    { params }: { params: { slug: string; photo_seq_id: string } }
) {
    const routeLogger = log.withMetadata({
        route: 'api/photos/[slug]/[photo_seq_id]',
        projectId: params.slug,
        photoSeqId: params.photo_seq_id
    });

    routeLogger.info('Starting photo request');

    try {
        const sequence = parseInt(params.photo_seq_id, 10);

        if (isNaN(sequence)) {
            routeLogger.warn('Invalid sequence ID provided');
            return NextResponse.json(
                { error: 'Invalid sequence ID' },
                { status: 400 }
            );
        }

        routeLogger.withMetadata({ sequence }).debug('Fetching photo from database');

        const photo = await findPhotoByProjectIdAndSeq(params.slug, sequence);

        if (!photo) {
            routeLogger.withMetadata({ sequence }).warn('Photo not found');
            return NextResponse.json(
                { error: 'Photo not found' },
                { status: 404 }
            );
        }

        routeLogger.withMetadata({ sequence, photoId: photo.id }).info('Photo retrieved successfully');

        return NextResponse.json(photo);
    } catch (error) {
        const dbError = error as DatabaseError;
        routeLogger
            .withError(error as Error)
            .withMetadata({ errorCode: dbError.code })
            .error('Failed to fetch photo');
        return NextResponse.json(
            { error: 'Failed to fetch photo', code: dbError.code },
            { status: 500 }
        );
    }
} 