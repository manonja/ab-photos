import React from "react";
export const runtime = "edge"

interface ProjectDetailsProps {
    slug: string
}

const ProjectDetails: React.FC<ProjectDetailsProps> = async ({slug}) => {


    return (
        <>
            <div className="mt-16 h-px bg-white w-full"/>
            <main className="flex min-h-screen flex-col items-center">
                <div className="flex w-full relative justify-center py-[2%] mx-auto ">
                    <div className="flex flex-wrap gap-4 md:flex-nowrap">
                        <div className="flex-2 w-full md:w-1/2 md:flex-initial"> {/* Column for the image */}
                            {slug}
                        </div>
                        <div className="flex-1 w-full md:w-1/2"> {/* Column for text content */}
                            <h2 className="text-2xl leading-relaxed mt-4 max-w-[90%] md:mt-0">Anton Bossenbroek is a
                                landscape photographer based in Turin, Italy. Anton explores the tension between human
                                exploitation of the landscape and its impact on the environment and society and the
                                natural
                                pristine lands.</h2> {/* Subtitle */}
                            <div className="my-8 h-px bg-white w-full max-w-[90%]"/>
                            <p className="mt-2 text-base leading-normal max-w-[90%]"> {/* Paragraph */}
                                Antons&apos;s background in computer science, machine learning, and artificial
                                intelligence
                                plays
                                a pivotal role in his artistic process. This fusion of technology and art enables him to
                                play in the intersection of technology, science, and photography. By integrating
                                analytical
                                techniques and innovative approaches, he is able to enhance the depth and detail of his
                                work, which he offers as a new way to engage with and understand the world around us.
                            </p>
                            <p className="mt-2 text-base leading-normal max-w-[90%]"> {/* Paragraph */}
                                Currently, Anton is engaged in a project initially developed in collaboration with
                                Magnum
                                through their mentorship program. This endeavor maps the artificial light over the
                                Netherlands at night, revealing the often unseen impacts of human existence on our
                                environment. It is a visual exploration that seeks to illustrate the hidden aspects of
                                our
                                daily lives.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

        </>


    );
}
export default ProjectDetails