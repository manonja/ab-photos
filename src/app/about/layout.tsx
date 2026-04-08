import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Anton Bossenbroek Photography',
  description:
    'Anton Bossenbroek is a documentary and landscape photographer living between The Netherlands and Canada.',
  openGraph: {
    title: 'About | Anton Bossenbroek Photography',
    description:
      'Anton Bossenbroek is a documentary and landscape photographer living between The Netherlands and Canada.',
    images: [
      {
        url: 'https://assets.bossenbroek.photo/anton_photo_resize.jpg',
        width: 800,
        height: 1000,
        alt: 'Anton Bossenbroek',
      },
    ],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
