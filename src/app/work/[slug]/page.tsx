import BackgroundImage from "@/app/work/components/backgroundImage";

export const runtime = 'edge';

export default function ProjectPage({ params }: { params: { slug: string } }) {
    return (
        <main className="flex min-h-screen flex-col justify-between items-center p-6">
            <BackgroundImage slug={params.slug}/>
        </main>
    )
}