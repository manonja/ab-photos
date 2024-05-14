
// Mapping of slugs to titles
import prisma from "../../prisma/client";

const slugToTitleMap: Record<string, string> = {
    "pyrenees": "Pyrénées",
    "7-rad": "7 Rad",
    "industry": "Industry"
};

export async function getProjectIdBySlug(slug: string): Promise<string | null> {
    try {
        const title = slugToTitleMap[slug];
        console.log("TITLE", title)
        if (!title) {
            console.error('No project found for the given slug.');
            return null;
        }

        const project = await prisma.project.findUnique({
            where: {
                title: title
            },
            select: {
                id: true
            }
        });

        if (project) {
            return project.id;
        } else {
            console.error('No project found for the given title.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching project ID:', error);
        return null;
    }
}