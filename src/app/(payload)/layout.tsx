import type { Metadata } from 'next'
import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import React from 'react'
import '@payloadcms/next/css'

export const metadata: Metadata = {
  title: 'AB Photos Admin',
  description: 'Content management for AB Photos',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout config={config}>{children}</RootLayout>
}
