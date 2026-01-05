'use client'

interface SpacerBlockProps {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  xs: 'h-4',
  sm: 'h-8',
  md: 'h-16',
  lg: 'h-24',
  xl: 'h-32',
}

export const SpacerComponent: React.FC<SpacerBlockProps> = ({ size }) => {
  return <div className={sizeClasses[size]} aria-hidden="true" />
}

export default SpacerComponent
