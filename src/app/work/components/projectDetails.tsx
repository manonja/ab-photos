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
    <main className="flex w-full flex-col lg:px-2">
      {/* Grid Studio layout: 32px page margins (root layout supplies 24px via
          p-6, px-2 adds the remaining 8px), 5 columns, 24px gutter.
          inkShift pulls the first glyph's side bearing back so its ink starts
          at the margin. */}
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
      {/* Saved grid: date col 2, subtitle cols 3-4 (same row), body cols 3-4
          in two text columns on the next row, tight under the subtitle. */}
      <div className="mt-2 p-4 lg:grid lg:grid-cols-5 lg:gap-x-6 lg:p-0">
        <div className="text-[32px] font-bold leading-none lg:col-start-2 lg:col-span-2 lg:row-start-1">
          {date}
        </div>
        <div className="mt-12 text-2xl lg:col-start-3 lg:col-span-2 lg:row-start-1 lg:mt-0">
          {subtitle}
        </div>
        <div className="lg:col-start-3 lg:col-span-2 lg:row-start-2">
          <div className="my-3 h-px bg-gray-300 w-full max-w-[40%]" />
          {/* One text, flowed over two balanced columns on large screens */}
          <div className="mt-2 text-base leading-normal text-justify hyphens-auto lg:columns-2 lg:gap-10">
            <p>{description}</p>
            {complementaryText && <p className="mt-4">{complementaryText}</p>}
          </div>
        </div>
      </div>
    </main>
  )
}
export default ProjectDetails
