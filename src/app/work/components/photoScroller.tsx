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
          className="flex h-svh w-full snap-start snap-always items-center justify-center p-3 lg:p-10"
        >
          {/* The figure shrink-wraps to the rendered image, so the caption's
              right edge follows the image's right edge, not the window's. */}
          <figure className="flex max-h-full max-w-full flex-col items-center">
            <Image
              src={photo.desktop_blob}
              alt={photo.caption || ''}
              width={2400}
              height={1600}
              sizes="100vw"
              className="h-auto w-auto object-contain"
              style={{ maxHeight: 'calc(100svh - 6rem)', maxWidth: '100%' }}
              referrerPolicy="no-referrer"
              unoptimized
            />
            {photo.caption && (
              <figcaption className="mt-2 w-full text-right text-sm text-gray-400">
                {photo.caption}
              </figcaption>
            )}
          </figure>
        </section>
      ))}
    </div>
  )
}

export default PhotoScroller
