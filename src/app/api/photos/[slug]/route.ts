import { NextResponse } from 'next/server';
import prisma from "../../../../../prisma/client";
import {getProjectIdBySlug} from "@/utils/getProjectIdBySlug";

export const runtime = 'edge';

type HandlerParams = {
    params: { slug: string };
}

// Get all the images info by projectId
export async function GET(req: Request, { params }: HandlerParams): Promise<NextResponse> {
    const { slug } = params;
    const projectId = await getProjectIdBySlug(slug)
    // Retrieve the project by name
    const imageList = await prisma.photo.findMany({
        // @ts-ignore
        where: { projectId: projectId  },
        orderBy: [
            {
                sequence: 'asc'
            }],
        select: {
            id: true,
            caption: true,
            desktop_blob: true,
        }
    });

    const updatedImageList = imageList.map(item => ({
        ...item,
        thumbnail: `/api/thumbnail/${item.id}.jpg`
    }));

    // Return all thumbnails in a response
    return NextResponse.json(updatedImageList);
}