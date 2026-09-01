export const getSubtitle = (slug: string): string => {
  let subtitle: string
  if (slug === '7-rad') {
    subtitle =
      '7 Rad traces nighttime radiance across the Dutch countryside, where greenhouses and farmland glow.'
  } else if (slug === 'pyrenees') {
    subtitle =
      'Through rugged landscapes and solitary trails, this project captures the profound stillness and untamed beauty of the Pyrenees, inviting a reconnection with the wild essence within us.'
  } else {
    subtitle = ''
  }
  return subtitle
}
