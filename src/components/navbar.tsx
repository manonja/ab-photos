'use client';

import React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarWorkDropdown from "@/app/work/components/NavbarWorkDropdown";
import { useScrollDirection } from "@/hooks/useScrollDirection";

export default function Navbar() {
    const pathname = usePathname();
    const scrollDirection = useScrollDirection({ threshold: 10 });
    const isHomepage = pathname === '/';

    // Auto-hide navigation on scroll (except on homepage)
    const shouldHideNav = !isHomepage && scrollDirection === 'down';

    return (
        <div className="z-10 w-full px-6 items-center justify-between text-sm lg:flex">
            <Link
                className="text-6xl font-[anton] left-0 top-0 flex w-full justify-center p-6 lg:static lg:w-auto"
                href="/"
                aria-label="Anton Bossenbroek Photography - Home"
            >
                ANTON BOSSENBROEK
            </Link>
            <div
                className={`fixed items-center lg:pb-6 pb-3 bottom-0 lg:gap-4 left-0 flex flex-col lg:flex-row h-auto w-full lg:items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none transition-transform duration-300 ease-in-out ${
                    shouldHideNav ? 'translate-y-full' : 'translate-y-0'
                }`}
            >

                <div className='flex flex-row gap-6 lg:gap-4'>
                    {/* Work - Desktop only */}
                    <Suspense fallback={
                        <span className="hidden lg:flex place-items-center gap-2 pr-1 p-2 pointer-events-auto lg:p-0 hover:border-b cursor-default uppercase">
                            Work
                        </span>
                    }>
                        <div className="hidden lg:flex">
                            <NavbarWorkDropdown />
                        </div>
                    </Suspense>

                    {/* Mobile navigation - Exhibitions, News, About only */}
                    <Link
                        className="flex place-items-center gap-2 px-3 py-3 pointer-events-auto lg:px-0 lg:py-0 hover:border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:focus-visible:ring-offset-2 uppercase"
                        href="/exhibitions"
                        aria-label="View exhibitions"
                    >
                        Exhibitions
                    </Link>
                    <Link
                        className="flex place-items-center gap-2 px-3 py-3 pointer-events-auto lg:px-0 lg:py-0 hover:border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:focus-visible:ring-offset-2 uppercase"
                        href="/news"
                        aria-label="Read news"
                    >
                        News
                    </Link>
                    <Link
                        className="flex place-items-center gap-2 px-3 py-3 pointer-events-auto lg:px-0 lg:py-0 hover:border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:focus-visible:ring-offset-2 uppercase"
                        href="/about"
                        aria-label="About Anton Bossenbroek"
                    >
                        About
                    </Link>

                    {/* Contact - Desktop only */}
                    <Link
                        className="hidden lg:flex place-items-center gap-2 pr-1 p-2 pointer-events-auto lg:p-0 hover:border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 uppercase"
                        href="/contact"
                        aria-label="Contact"
                    >
                        Contact
                    </Link>

                    {/* Subscribe - Desktop only */}
                    <Link
                        className="hidden lg:flex place-items-center gap-2 pr-4 p-2 pointer-events-auto lg:p-0 hover:border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 uppercase"
                        href="/subscribe"
                        aria-label="Subscribe to newsletter"
                    >
                        Subscribe
                    </Link>
                </div>
                <div className='flex flex-row lg:pl-6 gap-4'>
                    <a
                        href="https://www.instagram.com/anton__photography"
                        className="text-xs text-neutral-600 flex place-items-center gap-2 p-3 pointer-events-auto lg:p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:focus-visible:ring-offset-2"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Follow Anton Bossenbroek on Instagram"
                    >
                        <img
                            src="/instagram.svg"
                            alt="Instagram"
                            width="20"
                            height="20"
                        />
                    </a>
                    <a
                        href="https://www.facebook.com/anton.bossenbroek"
                        className="text-xs text-neutral-600 flex place-items-center p-3 pointer-events-auto lg:p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:focus-visible:ring-offset-2"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Follow Anton Bossenbroek on Facebook"
                    >
                        <img
                            src="/facebook.svg"
                            alt="Facebook"
                            width="20"
                            height="20"
                        />
                    </a>
                </div>
            </div>
        </div>
    )
}