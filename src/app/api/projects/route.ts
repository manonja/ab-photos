import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import getProjectSlug from "@/utils/getProjectSlug";

export const runtime = "edge";
export async function GET() {
    const projects = await prisma.project.findMany({
        select: {
            title: true,
            id: true
        }
    });

    const updatedProjectList = projects.map(item => ({
        ...item,
        slug: getProjectSlug(item.title)
    })).filter((project) => project.title !== "Homepage");
    return NextResponse.json(updatedProjectList);
}
