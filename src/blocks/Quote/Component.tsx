'use client'

interface QuoteBlockProps {
  quote: string
  attribution?: string
  style?: 'default' | 'large' | 'minimal'
}

export const QuoteComponent: React.FC<QuoteBlockProps> = ({
  quote,
  attribution,
  style = 'default',
}) => {
  const styleClasses = {
    default: 'text-xl md:text-2xl',
    large: 'text-2xl md:text-4xl',
    minimal: 'text-lg md:text-xl',
  }

  const borderClasses = {
    default: 'border-l-4 border-white/30 pl-6',
    large: 'border-l-4 border-white/50 pl-8',
    minimal: '',
  }

  return (
    <section className="w-full py-12 max-w-4xl mx-auto">
      <blockquote className={`${borderClasses[style]} ${styleClasses[style]} italic font-light text-white/90`}>
        <p className="mb-4">&ldquo;{quote}&rdquo;</p>
        {attribution && (
          <footer className="text-base font-normal text-white/60 not-italic">
            &mdash; {attribution}
          </footer>
        )}
      </blockquote>
    </section>
  )
}

export default QuoteComponent
