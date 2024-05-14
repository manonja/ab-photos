import React from "react";

export default function Navbar() {
    return (
        <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex">
            <p className="fixed text-5xl left-0 top-0 flex w-full justify-center p-6 lg:static lg:w-auto ">
                ANTON BOSSENBROEK
            </p>
            <div
                className="fixed pb-6 bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                <a
                    className="pointer-events-none flex place-items-center gap-2 lg:pr-6 pr-1 p-8 lg:pointer-events-auto lg:p-0 hover:border-b"
                    href="/"
                    rel="noopener noreferrer"
                >
                    Work
                </a>
                <a
                    className="pointer-events-none flex place-items-center gap-2 pr-1 lg:pr-6 p-8 lg:pointer-events-auto lg:p-0 hover:border-b"
                    href="/about"
                    rel="noopener noreferrer"
                >
                    About
                </a>
                <a
                    className="pointer-events-none flex place-items-center gap-2 pr-1 lg:pr-6 p-8 lg:pointer-events-auto lg:p-0 hover:border-b"
                    href="/contact"
                    rel="noopener noreferrer"
                >
                    Contact
                </a>
                <a
                    className="pointer-events-none flex place-items-center gap-2  pr-1 lg:pr-6 p-8 lg:pointer-events-auto lg:p-0 hover:border-b"
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    rel="noopener noreferrer"
                >
                    Subscribe
                </a>
            </div>
        </div>
    )
}