import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import PlausibleProvider from 'next-plausible';


import "./globals.css";
import Navbar from "@/components/navbar";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anton Bossenbroek Photography",
  description: "Anton Bossenbroek photography portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <PlausibleProvider domain="bossenbroek.photo" />
    </head>
    <body className={lexend.className}>
    <main className="flex min-h-screen flex-col items-center justify-between p-6">
      <Navbar/>
      {children}
    </main>
   </body>

    </html>
  );
}
