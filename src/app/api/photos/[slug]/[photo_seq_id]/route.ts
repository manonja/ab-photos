import { NextResponse } from 'next/server'
import { findPhotoByProjectIdAndSeq } from '@/db/operations'
import type { DatabaseError } from '@/db/types'
import { log } from '@/lib/logger'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; photo_seq_id: string }> },
) {
  const { slug, photo_seq_id } = await params
  const routeLogger = log.withMetadata({
    route: 'api/photos/[slug]/[photo_seq_id]',
    projectId: slug,
    photoSeqId: photo_seq_id,
  })

  routeLogger.info('Starting photo request')

  try {
    const sequence = parseInt(photo_seq_id, 10)

    if (Number.isNaN(sequence)) {
      routeLogger.warn('Invalid sequence ID provided')
      return NextResponse.json({ error: 'Invalid sequence ID' }, { status: 400 })
    }

    routeLogger.withMetadata({ sequence }).debug('Fetching photo from database')

    const photo = await findPhotoByProjectIdAndSeq(slug, sequence)

    if (!photo) {
      routeLogger.withMetadata({ sequence }).warn('Photo not found')
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    routeLogger.withMetadata({ sequence, photoId: photo.id }).info('Photo retrieved successfully')

    return NextResponse.json(photo)
  } catch (error) {
    const dbError = error as DatabaseError
    routeLogger
      .withError(error as Error)
      .withMetadata({ errorCode: dbError.code })
      .error('Failed to fetch photo')
    return NextResponse.json(
      { error: 'Failed to fetch photo', code: dbError.code },
      { status: 500 },
    )
  }
}
