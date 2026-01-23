import { NextResponse } from 'next/server';
import { findAllProjects } from '@/db/operations';
import { DatabaseError } from '@/db/types';
import { log } from '@/lib/logger';

export const runtime = 'edge';

export async function GET() {
    const routeLogger = log.withMetadata({ route: 'api/projects' });

    try {
        const projects = await findAllProjects();
        routeLogger.withMetadata({ projectCount: projects.length }).info('Projects retrieved successfully');
        return NextResponse.json(projects);
    } catch (error) {
        const dbError = error as DatabaseError;
        routeLogger
            .withError(error as Error)
            .withMetadata({ errorCode: dbError.code })
            .error('Failed to fetch projects');
        return NextResponse.json(
            { error: 'Failed to fetch projects', code: dbError.code },
            { status: 500 }
        );
    }
}
