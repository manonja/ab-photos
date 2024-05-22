import ProjectDetails from "@/app/work/components/projectDetails";
import ProjectPhotos from "@/app/work/components/projectPhotos";

export const runtime = 'edge';

export default function ProjectPage({ params }: { params: { slug: string } }) {
    return (
        <main className="flex min-h-screen flex-col w-[90%] justify-between items-center lg:p-6 p-2">
            <ProjectDetails slug={params.slug}/>
            <ProjectPhotos slug={params.slug}/>
        </main>
    )
}