import prisma from "../../prisma/client";
import getProjectSlug from "@/utils/getProjectSlug";

export const runtime = "edge"

export async function getProjectsDetails() {
    const projects = await prisma.project.findMany({
        select: {
            title: true,
            id: true
        }
    });

    return projects.map(item => ({
        ...item,
        slug: getProjectSlug(item.title)
    }));
}