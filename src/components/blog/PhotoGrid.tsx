interface PhotoGridProps {
  spacing?: 'tight' | 'normal' | 'loose'
  children: React.ReactNode
}

export function PhotoGrid({ spacing = 'normal', children }: PhotoGridProps) {
  const gapClass = {
    tight: 'gap-2',
    normal: 'gap-4',
    loose: 'gap-8'
  }[spacing]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gapClass} my-8`}>
      {children}
    </div>
  )
}