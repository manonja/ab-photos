export const getComplementaryText = (slug: string): string => {
  let complementaryText: string
  if (slug === '7-rad') {
    complementaryText =
      'To make these photographs, I stopped looking for landscapes and started looking at data. VIIRS — the Visible Infrared Imaging Radiometer Suite, carried on a polar-orbiting satellite — records how much artificial light reaches space from each patch of ground every night; that measurement is called radiance, or Rad, which gives the project its title. I used renderings of this data as a compass, letting the brightest points on the map decide where I pointed my camera rather than choosing a view first. Nine open-government requests showed me that municipalities enforce light-pollution rules on growers to noticeably different standards from town to town. Today the Milky Way can reliably be seen from only one island in the northern Netherlands, which leaves me wondering whether Dutch children will grow up able to find it, or to know that a tomato still needs the sun as much as a grow-lamp does.'
  } else if (slug === 'pyrenees') {
    complementaryText =
      'Traveling with analog photography equipment also reminded us of the importance, rarity, and difficulty of slowing down today. The photographic project, combined with the challenging terrain, forced us to go with the elements. This project aims to inspire and invite the viewer to slow down, and through adventure and nature, to reconnect with the wild and healing force within us.'
  } else {
    complementaryText = ''
  }
  return complementaryText
}
