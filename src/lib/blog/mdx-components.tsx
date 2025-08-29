import Image from 'next/image'
import Link from 'next/link'
import { ImageGallery, Quote, VideoEmbed, PhotoGrid } from '@/components/blog'

// Define custom components for MDX
export const components = {
  // Override default elements
  img: ({ src, alt }: { src?: string; alt?: string }) => {
    if (!src) return null
    return (
      <figure className="my-8">
        <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={src}
            alt={alt || ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
        {alt && (
          <figcaption className="text-sm text-gray-600 text-center mt-2">
            {alt}
          </figcaption>
        )}
      </figure>
    )
  },
  
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    if (!href) return <>{children}</>
    
    const isInternal = href.startsWith('/')
    
    if (isInternal) {
      return (
        <Link href={href} className="text-blue-600 hover:text-blue-800 hover:underline">
          {children}
        </Link>
      )
    }
    
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {children}
      </a>
    )
  },

  // Typography elements
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">{children}</h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-xl font-semibold mt-4 mb-2 text-gray-900">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-600">
      {children}
    </blockquote>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-gray-300" />,
  
  // Custom components available in MDX
  ImageGallery,
  Quote,
  VideoEmbed,
  PhotoGrid,
}