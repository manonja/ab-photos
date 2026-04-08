import type { Metadata } from 'next'
import { Anton, Lexend } from 'next/font/google'

import './globals.css'
import NavbarWorkDropdown from '@/app/work/components/NavbarWorkDropdown'
import Navbar from '@/components/navbar'

const lexend = Lexend({ subsets: ['latin'] })
const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton',
})

// Static metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://bossenbroek.photo'),
  title: 'Anton Bossenbroek Photography',
  description: 'Anton Bossenbroek photography portfolio',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Anton Bossenbroek Photography',
    description: 'Documentary and landscape photography by Anton Bossenbroek',
    url: 'https://bossenbroek.photo',
    siteName: 'Anton Bossenbroek Photography',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://assets.bossenbroek.photo/anton_photo_resize.jpg',
        width: 800,
        height: 1000,
        alt: 'Anton Bossenbroek Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anton Bossenbroek Photography',
    description: 'Documentary and landscape photography by Anton Bossenbroek',
    images: ['https://assets.bossenbroek.photo/anton_photo_resize.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script defer data-domain="bossenbroek.photo" src="https://plausible.io/js/script.js" />
      </head>
      <body className={`${lexend.className} ${anton.variable}`}>
        <main className="flex min-h-screen flex-col items-center justify-between p-6">
          <Navbar workDropdown={<NavbarWorkDropdown />} />
          {children}
        </main>
      </body>
    </html>
  )
}
