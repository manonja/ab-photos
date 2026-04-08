import BackgroundImage from '@/app/work/components/backgroundImage'
import ProjectDetails from '@/app/work/components/projectDetails'
import ProjectPhotos from '@/app/work/components/projectPhotos'

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <BackgroundImage slug={slug} random={true} />
      <main className="flex min-h-screen flex-col lg:w-[90%] justify-between items-center lg:p-6 p-2">
        <div className="mt-40 lg:pt-0 h-px bg-white w-full" />
        <ProjectDetails slug={slug} />
        <div className="lg:mt-32 mt-16 lg:pt-0 h-px w-full" />
        <ProjectPhotos slug={slug} />
      </main>
    </>
  )
}
