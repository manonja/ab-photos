export const getComplementaryText = (slug: string): string => {
  let complementaryText: string
  if (slug === '7-rad') {
    complementaryText =
      'To make these photographs, I stopped looking for landscapes and started looking at data. VIIRS — the Visible Infrared Imaging Radiometer Suite, carried on a polar-orbiting satellite — records how much artificial light reaches space from each patch of ground every night; that measurement is called radiance, or Rad, which gives the project its title. I used renderings of this data as a compass, letting the brightest points on the map decide where I pointed my camera rather than choosing a view first. Today the Milky Way can reliably be seen from one island in the northern Netherlands, and I sometimes wonder whether the children cycling past these greenhouses will ever learn to find it.'
  } else if (slug === 'pyrenees') {
    complementaryText =
      'Traveling with analog photography equipment also reminded us of the importance, rarity, and difficulty of slowing down today. The photographic project, combined with the challenging terrain, forced us to go with the elements. This project aims to inspire and invite the viewer to slow down, and through adventure and nature, to reconnect with the wild and healing force within us.'
  } else {
    complementaryText = ''
  }
  return complementaryText
}
