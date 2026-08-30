'use client'

import Image from 'next/image'
import type React from 'react'
import { useEffect, useRef } from 'react'
import type { Photo } from '@/types/database'

interface PhotoScrollerProps {
  photos: Photo[]
}

/**
 * Full-window photo viewer with snap scrolling.
 * Each photo fills the viewport with its caption at the bottom; scrolling (wheel, touch)
 * snaps smoothly from one photo to the next. Arrow keys, j/k, space and page up/down
 * move one photo at a time.
 */
const PhotoScroller: React.FC<PhotoScrollerProps> = ({ photos }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Snap scrolling must live on the document scroll container so the hero
    // section above participates; scoped to mount so other pages are unaffected.
    const html = document.documentElement
    html.classList.add('snap-y', 'snap-mandatory')
    return () => {
      html.classList.remove('snap-y', 'snap-mandatory')
    }
  }, [])

  useEffect(() => {
    const sections = () => Array.from(document.querySelectorAll<HTMLElement>('[data-snap-section]'))

    const currentIndex = (els: HTMLElement[]) => {
      const mid = window.scrollY + window.innerHeight / 2
      let best = 0
      let bestDist = Number.POSITIVE_INFINITY
      els.forEach((el, i) => {
        const center = el.offsetTop + el.offsetHeight / 2
        const dist = Math.abs(center - mid)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      return best
    }

    const step = (direction: 1 | -1) => {
      const els = sections()
      if (!els.length) return
      const target = els[Math.min(els.length - 1, Math.max(0, currentIndex(els) + direction))]
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable))
        return

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case 'j':
          e.preventDefault()
          step(1)
          break
        case ' ':
          e.preventDefault()
          step(e.shiftKey ? -1 : 1)
          break
        case 'ArrowUp':
        case 'PageUp':
        case 'k':
          e.preventDefault()
          step(-1)
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div ref={containerRef} className="w-full">
      {photos.map((photo) => (
        <section
          key={photo.id}
          data-snap-section
          className="relative h-svh w-full snap-start snap-always"
        >
          <div className="absolute inset-x-0 top-0 bottom-16 p-3 pb-1 lg:p-10 lg:pb-2">
            <div className="relative h-full w-full">
              <Image
                src={photo.desktop_blob}
                alt={photo.caption || ''}
                fill
                sizes="100vw"
                className="object-contain"
                referrerPolicy="no-referrer"
                unoptimized
              />
            </div>
          </div>
          {photo.caption && (
            <p className="absolute inset-x-0 bottom-10 px-3 text-right italic text-sm text-gray-400 lg:px-10">
              {photo.caption}
            </p>
          )}
        </section>
      ))}
    </div>
  )
}

export default PhotoScroller
