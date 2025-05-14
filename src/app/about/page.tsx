'use client'

const CopyrightYear = () => {
  return <span>{new Date().getFullYear()}</span>
}

export default function About() {
    return (
        <>
            <main className="flex min-h-screen flex-col items-center p-6">
                <div className="flex w-full relative justify-center py-[6%] px-[2%] mx-auto ">
                    <div className="flex flex-wrap gap-4 lg:flex-nowrap">
                        <div className="flex-none w-full lg:w-1/2 lg:flex-initial lg:pt-0 pt-8">
                            <img 
                                src="https://assets.bossenbroek.photo/anton_photo_resize.jpg" alt="Anton Bossenbroek"
                                className="lg:w-[90%] h-auto lg:pt-3"
                                {...(process.env.NEXT_PUBLIC_API_URL === 'http://localhost:8788' && {
                                referrerPolicy: "no-referrer"
                                })}
                            />
                        </div>
                        <div className="flex-1 w-full lg:w-1/2 lg:pt-0 pt-8">
                            <h2 className="text-2xl leading-relaxed mt-4 max-w-[90%] md:mt-0">Anton Bossenbroek is a
                                landscape photographer living between The Netherlands and Canada. Anton explores the intersection
                                of technological progress and natural landscapes</h2>
                            <div className="my-8 h-px bg-white w-full max-w-[90%]"/>
                            <p className="mt-2 text-base leading-normal max-w-[90%]">
                                Anton&apos;s background in computer science, machine learning, and artificial
                                intelligence plays a pivotal role in his artistic process. Anton&apos;s uses medium and large
                                format to capture the grandeur and delicate balance of our world. This fusion of technology and
                                art enables him to play in the intersection of technology, science, and photography.
                            </p>
                            <p className="mt-2 text-base leading-normal max-w-[90%]">
                                Currently, Anton is engaged in a project initially developed in collaboration with
                                Magnum through their mentorship program. This endeavor maps the artificial light over the
                                Netherlands at night, a visual exploration that seeks to illustrate the hidden aspects of
                                our daily lives.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="text-xs text-gray-300 italic max-w-7xl">Copyright <CopyrightYear /> — Anton Bossenbroek Photography.
            </footer>
        </>
    )
}