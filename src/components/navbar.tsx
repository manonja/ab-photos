import React from "react";
import { Suspense } from "react";
import NavbarWorkDropdown from "@/app/work/components/NavbarWorkDropdown";

export default function Navbar() {
    return (
        <div className="z-10 w-full px-6 items-center justify-between text-sm lg:flex">
            <a className="text-6xl font-[anton] left-0 top-0 flex w-full justify-center p-6 lg:static lg:w-auto " href="/"   rel="noopener noreferrer">
                ANTON BOSSENBROEK
            </a>
            <div
                className=" fixed items-center lg:pb-6 pb-2 bottom-0 lg:gap-4 left-0 flex flex-col lg:flex-row h-auto w-full lg:items-end justify-center bg-gradient-to-t from-white via-white dark:from-black lg:static lg:h-auto lg:w-auto lg:bg-none">

                <div className='flex flex-row gap-4'>
                    <Suspense fallback={
                        <a className="flex place-items-center gap-2 pr-1 p-2 pointer-events-auto lg:p-0 hover:border-b" href="/work">
                            Work
                        </a>
                    }>
                        <NavbarWorkDropdown />
                    </Suspense>
                    <a
                        className="flex place-items-center gap-2 pr-1 p-2 pointer-events-auto lg:p-0 hover:border-b"
                        href="/news"
                        rel="noopener noreferrer"
                    >
                        News
                    </a>
                    <a
                        className="flex place-items-center gap-2 pr-1  p-2 pointer-events-auto lg:p-0 hover:border-b"
                        href="/about"
                        rel="noopener noreferrer"
                    >
                        About
                    </a>
                    <a
                        className="flex place-items-center gap-2 pr-1 p-2 pointer-events-auto lg:p-0 hover:border-b"
                        href="/contact"
                        rel="noopener noreferrer"
                    >
                        Contact
                    </a>
                    <a
                        className="flex place-items-center gap-2  pr-4 p-2 pointer-events-auto lg:p-0 hover:border-b"
                        href="/subscribe"
                        rel="noopener noreferrer"
                    >
                        Subscribe
                    </a>


                </div>
                <div className='flex flex-row lg:pl-6 gap-2'>
                    <a
                        href="https://www.instagram.com/anton__photography"
                        className="text-xs text-neutral-600 flex place-items-center gap-2 py-2 pointer-events-auto lg:p-0"
                    >
                        <img
                            src="/instagram.svg"
                            alt="instagram icon"
                            rel="noopener noreferrer"
                        />
                    </a>
                    <a
                        href="https://www.facebook.com/anton.bossenbroek"
                        className="text-xs text-neutral-600 flex place-items-center py-2 pointer-events-auto lg:p-0"
                    >
                        <img
                            src="/facebook.svg"
                            alt="instagram icon"
                            rel="noopener noreferrer"
                        />
                    </a>
                </div>
            </div>
        </div>
    )
}