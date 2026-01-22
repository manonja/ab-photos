import { NextResponse } from 'next/server';
import { findAllProjects } from '@/db/operations';
import { DatabaseError } from '@/db/types';

export async function GET() {
    try {
        const projects = await findAllProjects();
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        const dbError = error as DatabaseError;
        return NextResponse.json(
            { error: 'Failed to fetch projects', code: dbError.code },
            { status: 500 }
        );
    }
}
