import type { Metadata } from 'next'
import { getPhotoDetails } from '@/actions/getPhotoDetails'
import BackgroundImage from '@/app/work/components/backgroundImage'
import ProjectDetails from '@/app/work/components/projectDetails'
import ProjectPhotos from '@/app/work/components/projectPhotos'
import { getDescription } from '@/utils/getDescription'
import { getSubtitle } from '@/utils/getSubtitle'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const subtitle = getSubtitle(slug)
  const description = getDescription(slug)
  const displayTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  let ogImage: string | undefined
  try {
    const photos = await getPhotoDetails(slug)
    const photoArray = Array.isArray(photos) ? photos : photos ? [photos] : []
    if (photoArray.length > 0) {
      ogImage = photoArray[0].desktop_blob
    }
  } catch {
    // Fall through — OG image will use root layout default
  }

  return {
    title: `${displayTitle} | Anton Bossenbroek Photography`,
    description: subtitle || description || `Photography project: ${displayTitle}`,
    openGraph: {
      title: `${displayTitle} | Anton Bossenbroek Photography`,
      description: subtitle || description || `Photography project: ${displayTitle}`,
      type: 'article',
      ...(ogImage ? { images: [{ url: ogImage, alt: displayTitle }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayTitle} | Anton Bossenbroek Photography`,
      description: subtitle || description || `Photography project: ${displayTitle}`,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

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
