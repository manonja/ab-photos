import BackgroundImage from '@/app/work/components/backgroundImage'
import ProjectDetails from '@/app/work/components/projectDetails'
import ProjectPhotos from '@/app/work/components/projectPhotos'

export const runtime = 'edge'

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <BackgroundImage slug={params.slug} random={true} />
      <main className="flex min-h-screen flex-col lg:w-[90%] justify-between items-center lg:p-6 p-2">
        <div className="mt-40 lg:pt-0 h-px bg-white w-full" />
        <ProjectDetails slug={params.slug} />
        <div className="lg:mt-32 mt-16 lg:pt-0 h-px w-full" />
        <ProjectPhotos slug={params.slug} />
      </main>
    </>
  )
}
