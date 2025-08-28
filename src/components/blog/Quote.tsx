import { QuoteProps } from '@/lib/blog/types'

export function Quote({ author, children }: QuoteProps) {
  return (
    <blockquote className="relative my-8 px-8 py-6 bg-gray-50 rounded-lg">
      <div className="absolute top-4 left-4 text-6xl text-gray-200 leading-none">"</div>
      <div className="relative z-10">
        <p className="text-lg italic text-gray-700 leading-relaxed mb-3">
          {children}
        </p>
        <cite className="text-sm text-gray-600 not-italic">
          — {author}
        </cite>
      </div>
    </blockquote>
  )
}