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
      <main
        data-snap-section
        className="relative flex min-h-svh w-full flex-col justify-between lg:py-6 py-2 snap-start snap-always"
      >
        <div className="mt-24 w-full" />
        <ProjectDetails slug={slug} />
      </main>
      <ProjectPhotos slug={slug} />
    </>
  )
}
