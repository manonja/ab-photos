export type HeroAlign = 'top' | 'center' | 'bottom'

const HERO_ALIGN_BY_PROJECT: Record<string, HeroAlign> = {
  '7-rad': 'bottom',
}

/**
 * Vertical alignment of the full-screen hero image on a project page.
 * Controls which part of the photo stays visible when it is cropped to cover the viewport.
 */
export const getHeroAlign = (slug: string): HeroAlign => HERO_ALIGN_BY_PROJECT[slug] ?? 'center'
