import type React from 'react'
import { getComplementaryText } from '@/utils/getComplementaryText'
import { getDescription } from '@/utils/getDescription'
import { getSubtitle } from '@/utils/getSubtitle'
import { getTitleStyle } from '@/utils/getTitleStyle'

interface ProjectDetailsProps {
  slug: string
}

const ProjectDetails: React.FC<ProjectDetailsProps> = async ({ slug }) => {
  const subtitle = getSubtitle(slug)
  const description = getDescription(slug)
  const complementaryText = getComplementaryText(slug)
  const date = slug === 'pyrenees' ? 'Summer 2021' : slug === '7-rad' ? '2021-ongoing' : ''
  const titleStyle = getTitleStyle(slug)
  return (
    <main className="flex w-full flex-col">
      {/* Title and date sit flush to the viewport border; inkShift pulls the
          first glyph's side bearing back so its ink starts at the same pixel
          as the date below. */}
      <h1
        className="uppercase font-normal leading-none"
        style={{
          fontSize: titleStyle.fontSize,
          letterSpacing: titleStyle.letterSpacing,
          marginLeft: titleStyle.inkShift,
        }}
      >
        {slug.replace(/-/g, ' ')}
      </h1>
      <div className="mt-2 text-[42px] font-bold leading-none">{date}</div>
      <div className="mt-12 p-4 lg:mt-20 lg:w-2/3">
        <div className="text-2xl max-w-[45%]">{subtitle}</div> {/* Subtitle */}
        <div className="my-8 h-px bg-gray-300 w-full max-w-[40%]" />
        {/* One text, flowed over two balanced columns on large screens */}
        <div className="mt-2 text-base leading-normal text-justify hyphens-auto lg:columns-2 lg:gap-16">
          <p>{description}</p>
          {complementaryText && <p className="mt-4">{complementaryText}</p>}
        </div>
      </div>
    </main>
  )
}
export default ProjectDetails
