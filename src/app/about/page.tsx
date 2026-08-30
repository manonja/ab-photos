'use client'

import { Work_Sans } from 'next/font/google'
import Image from 'next/image'

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

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
              <Image
                src="https://assets.bossenbroek.photo/anton_photo_resize.jpg"
                alt="Anton Bossenbroek"
                width={800}
                height={1000}
                className="w-full lg:w-[90%] h-auto"
                unoptimized
              />
            </div>

            {/* Text container */}
            <div className="w-full lg:w-1/2">
              {/* Headline */}
              <h1 className="text-xl lg:text-2xl leading-relaxed mb-6 lg:mt-0">
                Anton Bossenbroek is a photographer living between the Netherlands and Canada.
              </h1>

              {/* Divider */}
              <div className="my-6 h-px bg-white w-full" />

              {/* Body text */}
              <p className={`mt-4 text-base leading-relaxed ${workSans.className}`}>
                He came to photography after twenty years as a machine learning engineer, and his
                approach remains forensic: photographs built alongside satellite data and national
                archives. His work has been developed through the FotoFilmic Annual Mentoring
                Program and a Magnum mentorship, featured by Der Greif, and shown in Paris, Seattle,
                Kuala Lumpur, and British Columbia.
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
