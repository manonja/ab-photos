import type { Metadata } from "next";
import { Lexend } from "next/font/google";

import "./globals.css";

const lexend = Lexend({ subsets: ["latin"] });

// Static metadata
export const metadata: Metadata = {
  title: "Anton Bossenbroek Photography",
  description: "Anton Bossenbroek photography portfolio",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <script defer data-domain="bossenbroek.photo" src="https://plausible.io/js/script.js"/>
      </head>
      <body className={lexend.className}>
        {children}
      </body>
    </html>
  );
}
