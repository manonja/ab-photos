export const getComplementaryText = (slug: string): string => {
  let complementaryText: string
  if (slug === '7-rad') {
    complementaryText =
      'My curiosity led me to NASA/NOAA VIIRS satellite data, which records some of the highest levels of artificial light at night (ALAN) in the world over the Netherlands. That observation set the direction of the work: photographing the interplay of light and darkness in these settings, where the scale of modern life meets the landscape that holds it.'
  } else if (slug === 'pyrenees') {
    complementaryText =
      'Traveling with analog photography equipment also reminded us of the importance, rarity, and difficulty of slowing down today. The photographic project, combined with the challenging terrain, forced us to go with the elements. This project aims to inspire and invite the viewer to slow down, and through adventure and nature, to reconnect with the wild and healing force within us.'
  } else {
    complementaryText = ''
  }
  return complementaryText
}
