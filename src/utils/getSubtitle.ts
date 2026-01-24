export const getSubtitle = (slug: string): string => {
  let subtitle: string
  if (slug === '7-rad') {
    subtitle =
      '7 Rad - is a visual exploration of how urban landscapes are transformed at night, depicting the grandeur, complexity and curiosity of a man-made environment.'
  } else if (slug === 'pyrenees') {
    subtitle =
      'Through rugged landscapes and solitary trails, this project captures the profound stillness and untamed beauty of the Pyrenees, inviting a reconnection with the wild essence within us.'
  } else {
    subtitle =
      'Industry is an attempt to explore the intimate relationship between aesthetics and human savoir-faire in building engineering.'
  }
  return subtitle
}
