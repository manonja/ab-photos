import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'
import type { Exhibit } from '@/types/exhibit'

interface ExhibitCardProps {
  exhibit: Exhibit
}

function formatExhibitDate(startDate: string, endDate: string): string {
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }
  const startStr = start.toLocaleDateString('en-US', opts)
  const endYear = end.getFullYear()

  if (start.getFullYear() !== endYear) {
    return `${startStr}, ${start.getFullYear()} – ${end.toLocaleDateString('en-US', opts)}, ${endYear}`
  }
  if (start.getMonth() === end.getMonth()) {
    return `${startStr} – ${end.getDate()}, ${endYear}`
  }
  return `${startStr} – ${end.toLocaleDateString('en-US', opts)}, ${endYear}`
}

const ExhibitCard: React.FC<ExhibitCardProps> = ({ exhibit }) => {
  const isExternal = exhibit.link?.startsWith('http')

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      {/* Image Section */}
      <div className="w-full md:w-auto md:max-w-md flex-shrink-0">
        <div className="relative w-full overflow-hidden bg-gray-900">
          <Image
            src={exhibit.featuredImage}
            alt={exhibit.title}
            width={600}
            height={400}
            className="object-cover w-full h-auto"
            sizes="(max-width: 768px) 100vw, 400px"
            unoptimized
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-start">
        <h2 className="mb-2 text-2xl text-font-bold leading-tight">
          {exhibit.link ? (
            <Link
              href={exhibit.link}
              className="hover:text-gray-400 transition-colors"
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
            >
              {exhibit.title}
            </Link>
          ) : (
            exhibit.title
          )}
        </h2>

        <div className="mb-1 text-sm uppercase text-gray-300">
          {exhibit.startDate && exhibit.endDate
            ? formatExhibitDate(exhibit.startDate, exhibit.endDate)
            : exhibit.date}
        </div>

        <div className="mb-3 text-sm text-gray-300">{exhibit.location}</div>

        <p className="mb-4 text-base text-gray-200">{exhibit.description}</p>
      </div>
    </div>
  )
}

export default ExhibitCard
