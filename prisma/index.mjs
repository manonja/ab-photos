import prisma from "./client.ts";

async function main() {

    await prisma.$connect();

    const project = await prisma.project.findUnique({
        where: {
            title: 'Homepage',
        },
    });

    if (project) {
        // Delete related photos
        await prisma.photo.deleteMany({
            where: {
                projectId: "6b5ffc6f-c1a4-452b-b151-11062563b005",
            },
        });

        // Delete the project
        await prisma.project.delete({
            where: {
                id: "6b5ffc6f-c1a4-452b-b151-11062563b005",
            },
        });

        console.log(`Project Homepage and its related photos have been deleted.`);
    } else {
        console.log(`Project Homepage not found.`);
    }

}

main()
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
