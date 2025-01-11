import { NextResponse } from 'next/server';
import { sql } from '@/db/client';

export const runtime = 'edge';

export async function GET() {
  try {
    const photos = await sql`
      SELECT 
        id,
        desktop_blob,
        mobile_blob,
        gallery_blob,
        sequence,
        caption,
        project_id
      FROM photos
      WHERE sequence = 1
      ORDER BY created_at DESC
      LIMIT 1
    `;

    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching featured photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured photos' },
      { status: 500 }
    );
  }
} 