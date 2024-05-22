import React from "react";

export default function Navbar() {
    return (
        <div className="z-10 w-full px-6 items-center justify-between font-mono text-sm lg:flex">
            <p className="fixed text-5xl left-0 top-0 flex w-full justify-center p-6 lg:static lg:w-auto ">
                ANTON BOSSENBROEK
            </p>
            <div
                className="fixed pb-6 bottom-0 gap-4 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                <a
                    className="pointer-events-none flex place-items-center gap-2 pr-1 p-4 lg:pointer-events-auto lg:p-0 hover:border-b"
                    href="/"
                    rel="noopener noreferrer"
                >
                    Work
                </a>
                <a
                    className="pointer-events-none flex place-items-center gap-2 pr-1  p-4 lg:pointer-events-auto lg:p-0 hover:border-b"
                    href="/about"
                    rel="noopener noreferrer"
                >
                    About
                </a>
                <a
                    className="pointer-events-none flex place-items-center gap-2 pr-1 p-4 lg:pointer-events-auto lg:p-0 hover:border-b"
                    href="/contact"
                    rel="noopener noreferrer"
                >
                    Contact
                </a>
                <a
                    className="pointer-events-none flex place-items-center gap-2  pr-4 p-4 lg:pointer-events-auto lg:p-0 hover:border-b"
                    href="/subscribe"
                    rel="noopener noreferrer"
                >
                    Subscribe
                </a>
                <div
                    className="flex place-items-center gap-2  pr-4 p-4 lg:p-0 lg:pr-2 "
                >
                    |
                </div>

                <a
                    href="https://www.instagram.com/anton__photography"
                    className="text-xs text-neutral-600 pointer-events-none flex place-items-center gap-2 py-4 lg:pointer-events-auto lg:p-0"
                >
                    <img
                        src="/instagram.svg"
                        alt="instagram icon"
                        rel="noopener noreferrer"
                    />
                </a>
                <a
                    href="https://www.facebook.com/anton.bossenbroek"
                    className="text-xs text-neutral-600 pointer-events-none flex place-items-center py-4 lg:pointer-events-auto lg:p-0"
                >
                    <img
                        src="/facebook.svg"
                        alt="instagram icon"
                        rel="noopener noreferrer"
                    />
                </a>
            </div>
        </div>
    )
}