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
    <main className="flex w-full flex-col lg:absolute lg:inset-x-2 lg:inset-y-0 lg:block">
      {/* Golden Studio layout: on lg every block sits at golden-section
          divisions of the screen — x as % of the width inside 32px margins
          (root p-6 gives 24px, inset-x-2 the remaining 8px), y as % of the
          full-height hero. Mobile keeps a stacked flow.
          inkShift pulls the first glyph's side bearing back so its ink
          starts at the margin. */}
      <h1
        className="uppercase font-normal leading-none lg:absolute lg:left-0 lg:top-[15.9%]"
        style={{
          fontSize: titleStyle.fontSize,
          letterSpacing: titleStyle.letterSpacing,
          marginLeft: titleStyle.inkShift,
        }}
      >
        {slug.replace(/-/g, ' ')}
      </h1>
      <div className="mt-2 p-4 lg:contents">
        {/* Lexend's built-in spacing is wide; tracking-tight brings the date
            back to normal. Golden x: 0.236 → 0.472. */}
        <div className="text-[32px] font-light leading-tight tracking-tight lg:absolute lg:left-[23.607%] lg:top-[41.6%] lg:w-[23.607%]">
          {date}
        </div>
        {/* Golden x: 0.472 → 0.854. */}
        <div className="mt-12 text-2xl leading-tight lg:absolute lg:left-[47.214%] lg:top-[48.5%] lg:mt-0 lg:w-[38.197%]">
          {subtitle}
        </div>
        <div className="lg:absolute lg:left-[47.214%] lg:top-[57%] lg:w-[38.197%]">
          <div className="my-3 h-px bg-gray-300 w-full max-w-[40%] lg:hidden" />
          {/* One text, flowed over two balanced columns on large screens */}
          <div className="mt-2 text-base leading-normal text-left lg:mt-0 lg:columns-2 lg:gap-10">
            <p>{description}</p>
            {complementaryText && <p className="mt-4">{complementaryText}</p>}
          </div>
        </div>
      </div>
    </main>
  )
}
export default ProjectDetails
