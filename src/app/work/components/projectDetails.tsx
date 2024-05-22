import React from "react";
import {getSubtitle} from "@/utils/getSubtitle";
import {getDescription} from "@/utils/getDescription";
export const runtime = "edge"

interface ProjectDetailsProps {
    slug: string
}

const ProjectDetails: React.FC<ProjectDetailsProps> = async ({slug}) => {
    const subtitle = getSubtitle(slug)
    const description = getDescription(slug)
    const date = slug === 'pyrenees' ? 'Summer 2021' : slug === "7-rad" ? '2019-2024' : '2018-present'
    return (
        <>
            <div className="mt-16 h-px bg-white w-full"/>
            <main className="flex flex-col items-center">
                <div className="flex w-full relative justify-center py-[2%] mx-auto ">
                    <div className="flex flex-wrap gap-2 md:flex-nowrap">
                        <div className="flex-1 w-full md:w-1/3 md:flex-initial p-4">
                            <div className="uppercase text-2xl font-light">{slug}</div>
                            <div className="pt-6 font-light italic">{date}</div>
                        </div>
                        <div className="flex-1 w-full md:w-1/3 p-4 "> {/* Column for text content */}
                            <h2 className="text-2xl leading-relaxed mt-4 max-w-[90%] md:mt-0">{subtitle}</h2> {/* Subtitle */}
                            <div className="my-8 h-px bg-white w-full max-w-[90%]"/>
                            <p className="mt-2 text-base leading-normal max-w-[90%]"> {/* Paragraph */}
                                {description}
                            </p>
                        </div>
                        {/*<div className="flex-1 w-full md:w-1/3 p-4">*/}
                        {/*    {description}*/}
                        {/*</div>*/}
                    </div>
                </div>
            </main>

        </>


    );
}
export default ProjectDetails