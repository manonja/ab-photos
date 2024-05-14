import BackgroundImage from "@/app/work/components/backgroundImage";

export const runtime = 'edge';

export default function ProjectPage({ params }: { params: { slug: string } }) {
    return (
            <BackgroundImage slug={params.slug}/>
    )
}