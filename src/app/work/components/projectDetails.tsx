import React from "react";
import {getSubtitle} from "@/utils/getSubtitle";
import {getDescription} from "@/utils/getDescription";
import {getComplementaryText} from "@/utils/getComplementaryText";
export const runtime = "edge"

interface ProjectDetailsProps {
    slug: string
}

const ProjectDetails: React.FC<ProjectDetailsProps> = async ({slug}) => {
    const subtitle = getSubtitle(slug)
    const description = getDescription(slug)
    const complementaryText = getComplementaryText(slug)
    const date = slug === 'pyrenees' ? 'Summer 2021' : slug === "7-rad" ? '2019-2024' : '2018-present'
    return (
        <>
            <main className="flex flex-col items-center">
                <div className="flex w-full relative justify-center lg:py-[6%] py-[2%] mx-auto">
                    <div className="flex flex-wrap gap-2 justify-around lg:flex-nowrap">
                        <div className="lg:flex-1 w-full lg:w-1/3 p-4">
                            <div className="uppercase text-2xl font-normal mt-0 lg:-mt-16">{slug}</div>
                            <div className="pt-6 font-light italic mt-0 lg:-mt-6">{date}</div>
                        </div>
                        <div className="lg:flex-1 w-full lg:w-1/3 p-4 "> {/* Column for text content */}
                            <div className="text-2xl max-w-[90%] ">{subtitle}</div> {/* Subtitle */}
                            <div className="my-8 h-px bg-gray-300 w-full max-w-[80%]"/>
                            <p className="mt-2 text-base leading-normal max-w-[90%]"> {/* Paragraph */}
                                {description}
                            </p>
                        </div>
                        {complementaryText && <div className="flex-1 w-full lg:w-1/3 p-4">
                            {complementaryText}
                        </div>}

                    </div>
                </div>
            </main>

        </>


    );
}
export default ProjectDetails