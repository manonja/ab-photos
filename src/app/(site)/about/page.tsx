"use client";

import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const CopyrightYear = () => {
  return <span>{new Date().getFullYear()}</span>;
};

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
                {...(process.env.NEXT_PUBLIC_API_URL ===
                  "http://localhost:8788" && {
                  referrerPolicy: "no-referrer",
                })}
              />
            </div>

            {/* Text container */}
            <div className="w-full lg:w-1/2">
              {/* Headline */}
              <h2 className="text-xl lg:text-2xl leading-relaxed mb-6 lg:mt-0">
                Anton Bossenbroek is a documentary and landscape photographer
                living between The Netherlands and Canada. His work investigates
                how hyperobjects — massive forces like pollution and industrial
                infrastructure — shape our world in ways that often go
                unnoticed.
              </h2>

              {/* Divider */}
              <div className="my-6 h-px bg-white w-full" />

              {/* Body text */}
              <p
                className={`mt-4 text-base leading-relaxed ${workSans.className}`}
              >
                Anton builds on 20 years of experience as a machine learning
                engineer and combines photography, data analysis, and geospatial
                imagery to explore the impact of humans on landscapes,
                societies, and communities. Through technology and personal
                observation, he reveals the far-reaching effects of industrial
                forces that remain hidden in daily life.
              </p>
              <p
                className={`mt-6 text-base leading-relaxed ${workSans.className}`}
              >
                Anton merges visual and factual layers to highlight the full
                impact of these hidden influences. He analyzes satellite data on
                light pollution, requests open government documents with the
                help of large language models, and visits national archives in
                South Africa. His work grounds itself in the belief that life
                often conceals the larger consequences of our consumption
                patterns and industrial demands.
              </p>
              <p
                className={`mt-6 text-base leading-relaxed ${workSans.className}`}
              >
                In his ongoing long-term project &quot;Sunsetting 64
                Megatons,&quot; Anton documents the largest C02 emitting plant
                in the world, in Secunda, South Africa, where he once worked as
                a Machine Learning expert. He now illustrates how the local
                community depends on an industry that needs to change for the
                sake of our climate. He weaves in portraits and personal
                narratives to remind viewers that these issues aren&apos;t just
                technical or economic—they involve real people whose lives could
                be upended as we shift away from carbon-intensive systems.
                Ultimately, Anton&apos;s work seeks to spark deeper reflection
                on how we can balance economic needs with our responsibility to
                care for both the planet and one another.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-xs text-gray-300 italic p-6 text-center">
        Copyright <CopyrightYear /> — Anton Bossenbroek Photography.
      </footer>
    </>
  );
}
