import { NextResponse } from 'next/server'
import { findAllNews } from '@/db/operations'
import type { DatabaseError } from '@/db/types'
import { log } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET() {
  const routeLogger = log.withMetadata({ route: 'api/news' })

  try {
    const posts = await findAllNews()
    routeLogger.withMetadata({ postCount: posts.length }).info('News posts retrieved successfully')
    return NextResponse.json(posts)
  } catch (error) {
    const dbError = error as DatabaseError
    routeLogger
      .withError(error as Error)
      .withMetadata({ errorCode: dbError.code })
      .error('Failed to fetch news')
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
