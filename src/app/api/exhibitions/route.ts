import { NextResponse } from 'next/server'
import { findAllExhibits } from '@/db/operations'
import type { DatabaseError } from '@/db/types'
import { log } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET() {
  const routeLogger = log.withMetadata({ route: 'api/exhibitions' })

  try {
    const exhibits = await findAllExhibits()
    routeLogger
      .withMetadata({ exhibitCount: exhibits.length })
      .info('Exhibits retrieved successfully')
    return NextResponse.json(exhibits)
  } catch (error) {
    const dbError = error as DatabaseError
    routeLogger
      .withError(error as Error)
      .withMetadata({ errorCode: dbError.code })
      .error('Failed to fetch exhibits')
    return NextResponse.json(
      { error: 'Failed to fetch exhibits', code: dbError.code },
      { status: 500 },
    )
  }
}
