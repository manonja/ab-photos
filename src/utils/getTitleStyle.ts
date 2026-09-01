export interface TitleStyle {
  /** CSS font-size; clamp() keeps huge titles from overflowing small screens */
  fontSize: string
  /** CSS letter-spacing */
  letterSpacing: string
  /** Negative left margin (em) pulling the first glyph's ink flush to the border */
  inkShift: string
}

const DEFAULT_STYLE: TitleStyle = {
  fontSize: 'clamp(56px, 10vw, 120px)',
  letterSpacing: '0em',
  inkShift: '-0.02em',
}

/** Per-project overrides so each title can be visually distinct. */
const TITLE_STYLE_BY_PROJECT: Record<string, Partial<TitleStyle>> = {
  '7-rad': {
    // 350px was chosen on a 1150px-tall studio canvas (~30% of height);
    // the svh term keeps that proportion on shorter screens.
    fontSize: 'clamp(80px, min(24vw, 30svh), 350px)',
    letterSpacing: '-0.05em',
    inkShift: '-0.04em',
  },
}

export const getTitleStyle = (slug: string): TitleStyle => ({
  ...DEFAULT_STYLE,
  ...TITLE_STYLE_BY_PROJECT[slug],
})
