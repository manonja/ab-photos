export default function About() {
    return (
        <>
            <main className="flex min-h-screen flex-col items-center p-6">
                <div className="flex w-full relative justify-center py-[6%] px-[2%] mx-auto ">
                    <div className="flex flex-wrap gap-4 lg:flex-nowrap"> {/* Flex container with wrapping enabled */}
                        <div
                            className="flex-none w-full lg:w-1/2 lg:flex-initial lg:pt-0 pt-8"> {/* Column for the image */}
                            <img src="https://assets.bossenbroek.photo/anton_photo_resize.jpg" alt="Anton Bossenbroek"
                                 className="lg:w-[90%] h-auto lg:pt-3"/>
                        </div>
                        <div className="flex-1 w-full lg:w-1/2 lg:pt-0 pt-8"> {/* Column for text content */}
                            <h2 className="text-2xl leading-relaxed mt-4 max-w-[90%] md:mt-0">Anton Bossenbroek is a
                                landscape photographer based in Turin, Italy. Anton explores the tension between human
                                exploitation of the landscape and its impact on the environment and society and the
                                natural pristine lands.</h2> {/* Subtitle */}
                            <div className="my-8 h-px bg-white w-full max-w-[90%]"/>
                            <p className="mt-2 text-base leading-normal max-w-[90%]"> {/* Paragraph */}
                                Anton&apos;s background in computer science, machine learning, and artificial
                                intelligence plays
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
            <footer className="text-xs text-gray-300 italic max-w-7xl">Copyright 2024 — Anton Bossenbroek Photography.
            </footer>
        </>


    )
}