import { NextResponse } from 'next/server'
import { findPhotosByProjectId } from '@/db/operations'
import type { DatabaseError } from '@/db/types'
import { log } from '@/lib/logger'

export const runtime = 'edge'

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const routeLogger = log.withMetadata({
    route: 'api/photos/[slug]',
    projectId: params.slug,
  })

  try {
    const photos = await findPhotosByProjectId(params.slug)

    if (!photos.length) {
      routeLogger.warn('No photos found for project')
      return NextResponse.json({ error: 'No photos found for this project' }, { status: 404 })
    }

    routeLogger.withMetadata({ photoCount: photos.length }).info('Photos retrieved successfully')
    return NextResponse.json(photos)
  } catch (error) {
    const dbError = error as DatabaseError
    routeLogger
      .withError(error as Error)
      .withMetadata({ errorCode: dbError.code })
      .error('Failed to fetch photos')
    return NextResponse.json(
      { error: 'Failed to fetch photos', code: dbError.code },
      { status: 500 },
    )
  }
}
