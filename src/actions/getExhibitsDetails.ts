import { findAllExhibits } from '@/db/operations'
import type { Exhibit } from '@/types/exhibit'

const FALLBACK_EXHIBITS: Exhibit[] = [
  {
    id: 'exhibit-1',
    title: 'AFMP 2024-25 Exhibition',
    date: 'July 5 – August 17, 2025',
    location: '103-555 Prometheus Pl, Bowen Island, BC, Canada',
    description: 'Inaugural group exhibition',
    featuredImage: '/images/exhibits/Fotofilmic-FullResolution.jpg',
    startDate: '2025-07-05',
    endDate: '2025-08-17',
    isActive: false,
    link: 'https://fotofilmic.com/afmp-exhibition-2024-2025/',
    isUpcoming: false,
  },
  {
    id: 'exhibit-2',
    title: 'CRITICAL EYE - PORTRAITS FROM THE STREET AWARDS 2025',
    date: 'Sept. 6 – Sept 21, 2025',
    location: 'Hin Bus Depot, Kuala Lumpur, Malaysia',
    description: 'Finalists of the Critical Eye Photography Awards 2025',
    featuredImage: '/images/exhibits/exhibit_2.jpeg',
    startDate: '2025-09-06',
    endDate: '2025-09-21',
    isActive: false,
    link: 'https://www.klphotoawards.com/home-2023',
    isUpcoming: false,
  },
  {
    id: 'exhibit-3',
    title: 'AFMP PARIS',
    date: 'Nov. 11 – Nov. 15, 2025',
    location: '43 Rue Charlot, Paris, France',
    description: 'FOTOFILMIC AFMP 2024-25 exhibition in Paris',
    featuredImage: '/images/exhibits/sasol.jpg',
    startDate: '2025-11-11',
    endDate: '2025-11-15',
    isActive: false,
    link: 'https://fotofilmic.com/afmp-exhibition-2024-2025/',
    isUpcoming: true,
  },
]

/**
 * Fetches exhibit details using 3-tier fallback:
 * 1. Direct D1 database access (Cloudflare Workers runtime)
 * 2. HTTP fetch from /api/exhibitions (during build)
 * 3. Static fallback data
 */
export async function getExhibitsDetails(): Promise<Exhibit[]> {
  // Strategy 1: Direct DB access (works on Cloudflare Workers runtime)
  try {
    console.log('[Action] getExhibitsDetails: Direct DB fetch')
    const exhibits = await findAllExhibits()
    console.log('[Action] getExhibitsDetails: Successfully fetched from DB', {
      exhibitCount: exhibits.length,
    })
    return exhibits
  } catch (dbError) {
    console.warn(
      '[Action] getExhibitsDetails: Direct DB access failed (expected during build)',
      dbError,
    )
  }

  // Strategy 2: HTTP fetch fallback (works during next build)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  if (!baseUrl) {
    console.warn('[Action] getExhibitsDetails: NEXT_PUBLIC_API_URL not defined, using fallback')
    return FALLBACK_EXHIBITS
  }

  try {
    console.log('[Action] getExhibitsDetails: HTTP fetch fallback')
    const response = await fetch(`${baseUrl}/api/exhibitions`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error('[Action] getExhibitsDetails: HTTP error', {
        status: response.status,
        statusText: response.statusText,
      })
      return FALLBACK_EXHIBITS
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      console.error('[Action] getExhibitsDetails: Invalid response format', data)
      return FALLBACK_EXHIBITS
    }

    const exhibits = data as Exhibit[]
    console.log('[Action] getExhibitsDetails: Successfully fetched via HTTP', {
      exhibitCount: exhibits.length,
    })
    return exhibits
  } catch (fetchError) {
    console.error('[Action] getExhibitsDetails: HTTP fetch also failed', fetchError)
  }

  // Strategy 3: Static fallback
  console.warn('[Action] getExhibitsDetails: All strategies failed, returning fallback')
  return FALLBACK_EXHIBITS
}
