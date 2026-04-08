import { NextResponse } from 'next/server'
import { findNewsBySlug } from '@/db/operations'
import type { DatabaseError } from '@/db/types'
import { log } from '@/lib/logger'

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const routeLogger = log.withMetadata({ route: 'api/news/[slug]', slug: params.slug })

  try {
    const post = await findNewsBySlug(params.slug)

    if (!post) {
      routeLogger.warn('News post not found')
      return NextResponse.json({ error: 'News post not found' }, { status: 404 })
    }

    routeLogger.withMetadata({ postId: post.id }).info('News post retrieved successfully')
    return NextResponse.json(post)
  } catch (error) {
    const dbError = error as DatabaseError
    routeLogger
      .withError(error as Error)
      .withMetadata({ errorCode: dbError.code })
      .error('Failed to fetch news post')
    return NextResponse.json(
      { error: 'Failed to fetch news post', code: dbError.code },
      { status: 500 },
    )
  }
}
