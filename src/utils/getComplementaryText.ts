export const getComplementaryText = (slug: string): string => {
  let complementaryText: string
  if (slug === '7-rad') {
    complementaryText =
      'My curiosity led me to analyze NASA/NOAA VIIRS satellite data, through which I confirmed that the Netherlands emits some of the highest levels of artificial light at night (ALAN) globally, far exceeding averages seen in other OECD countries. This discovery inspired me to capture the intricate interplay of light and darkness within urban settings, framing the grandeur of modern life alongside the complex relationship between human constructs and the natural world.'
  } else if (slug === 'pyrenees') {
    complementaryText =
      'Traveling with analog photography equipment also reminded us of the importance, rarity, and difficulty of slowing down today. The photographic project, combined with the challenging terrain, forced us to go with the elements. This project aims to inspire and invite the viewer to slow down, and through adventure and nature, to reconnect with the wild and healing force within us.'
  } else {
    complementaryText = ''
  }
  return complementaryText
}
