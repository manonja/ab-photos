import { VideoEmbedProps } from '@/lib/blog/types'

export function VideoEmbed({ url, title, aspectRatio = '16:9' }: VideoEmbedProps) {
  // Extract video ID and determine platform
  const getEmbedUrl = (url: string): string | null => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }
    
    return null
  }

  const embedUrl = getEmbedUrl(url)
  
  if (!embedUrl) {
    return (
      <div className="my-8 p-4 bg-gray-100 rounded-lg text-center text-gray-600">
        <p>Invalid video URL. Please use a YouTube or Vimeo link.</p>
      </div>
    )
  }

  const aspectClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square'
  }[aspectRatio]

  return (
    <div className={`relative ${aspectClass} my-8 overflow-hidden rounded-lg bg-gray-100`}>
      <iframe
        src={embedUrl}
        title={title || 'Embedded video'}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}