import ProjectDetails from "@/app/work/components/projectDetails";
import ProjectPhotos from "@/app/work/components/projectPhotos";

export const runtime = 'edge';

export default function ProjectPage({ params }: { params: { slug: string } }) {
    return (
        <main className="flex min-h-screen flex-col justify-between items-center p-6">
            <ProjectDetails slug={params.slug}/>
            <ProjectPhotos slug={params.slug}/>
        </main>
    )
}