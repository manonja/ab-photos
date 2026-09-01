import type React from 'react'
import { getComplementaryText } from '@/utils/getComplementaryText'
import { getDescription } from '@/utils/getDescription'
import { getSubtitle } from '@/utils/getSubtitle'

interface ProjectDetailsProps {
  slug: string
}

const ProjectDetails: React.FC<ProjectDetailsProps> = async ({ slug }) => {
  const subtitle = getSubtitle(slug)
  const description = getDescription(slug)
  const complementaryText = getComplementaryText(slug)
  const date = slug === 'pyrenees' ? 'Summer 2021' : slug === '7-rad' ? '2019-2024' : ''
  return (
    <main className="flex flex-col items-center">
      <div className="flex w-full relative justify-center lg:py-[6%] py-[2%] mx-auto">
        <div className="flex flex-wrap gap-2 justify-around lg:flex-nowrap">
          <div className="lg:flex-1 w-full lg:w-1/3 p-4 mt-8 lg:mt-0">
            <div className="-mt-10 uppercase text-2xl font-normal lg:-mt-16">{slug}</div>
            <div className="font-light italic ">{date}</div>
          </div>
          <div className="lg:flex-[2] w-full lg:w-2/3 p-4">
            <div className="text-2xl max-w-[45%]">{subtitle}</div> {/* Subtitle */}
            <div className="my-8 h-px bg-gray-300 w-full max-w-[40%]" />
            {/* One text, flowed over two balanced columns on large screens */}
            <div className="mt-2 text-base leading-normal lg:columns-2 lg:gap-16">
              <p>{description}</p>
              {complementaryText && <p className="mt-4">{complementaryText}</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
export default ProjectDetails
