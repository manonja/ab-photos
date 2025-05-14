'use client'

const CopyrightYear = () => {
  return <span>{new Date().getFullYear()}</span>
}

export default function About() {
    return (
        <>
            <main className="flex min-h-screen flex-col items-center p-6">
                <div className="w-full max-w-7xl mx-auto py-8 lg:py-[6%] px-4 lg:px-[2%]">
                    <div className="flex flex-col lg:flex-row lg:gap-8">
                        {/* Photo container */}
                        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                            <img 
                                src="https://assets.bossenbroek.photo/anton_photo_resize.jpg" 
                                alt="Anton Bossenbroek"
                                className="w-full lg:w-[90%] h-auto"
                                {...(process.env.NEXT_PUBLIC_API_URL === 'http://localhost:8788' && {
                                    referrerPolicy: "no-referrer"
                                })}
                            />
                        </div>
                        
                        {/* Text container */}
                        <div className="w-full lg:w-1/2">
                            {/* Headline */}
                            <h2 className="text-xl lg:text-2xl leading-relaxed mb-6 lg:mt-0">
                                Anton Bossenbroek is a landscape photographer living between The Netherlands and Canada. 
                                Anton explores the intersection of technological progress and natural landscapes
                            </h2>
                            
                            {/* Divider */}
                            <div className="my-6 h-px bg-white w-full" />
                            
                            {/* Body text */}
                            <p className="mt-4 text-base leading-relaxed">
                                Anton&apos;s background in computer science, machine learning, and artificial
                                intelligence plays a pivotal role in his artistic process. Anton&apos;s uses medium and large
                                format to capture the grandeur and delicate balance of our world. This fusion of technology and
                                art enables him to play in the intersection of technology, science, and photography.
                            </p>
                            <p className="mt-6 text-base leading-relaxed">
                                Currently, Anton is engaged in a project initially developed in collaboration with
                                Magnum through their mentorship program. This endeavor maps the artificial light over the
                                Netherlands at night, a visual exploration that seeks to illustrate the hidden aspects of
                                our daily lives.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="text-xs text-gray-300 italic p-6 text-center">
                Copyright <CopyrightYear /> — Anton Bossenbroek Photography.
            </footer>
        </>
    )
}