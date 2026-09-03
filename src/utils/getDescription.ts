export const getDescription = (slug: string): string => {
  let description: string
  if (slug === '7-rad') {
    description =
      '"When I think of the starry night, I think of a vacation in France." A cyclist said this to me in the Westland, the region locals call the Glass City. I moved back to the Netherlands in 2020, and it was the countryside, not any city, that struck me as impossibly bright at night. This is a nation that has spent centuries engineering its land against water, diking and draining field by field; today that same precision keeps greenhouses lit and warm through the winter, so the growing season never has to end. 7 Rad is my attempt to look directly at that light. Today the Milky Way can reliably be seen from one island in the northern Netherlands.'
  } else if (slug === 'sunsetting-64-megatons') {
    description =
      'In 2018 I knew Secunda only as data: I wrote algorithms to predict failures in the cooling systems of the Sasol plant, a facility that turns coal into liquid fuel and releases sixty-four megatons of carbon dioxide a year, more than any other single site on Earth. The Fischer–Tropsch process it runs on was industrialized in Germany in the 1930s; South Africa had used it since the 1950s, and Secunda itself was built between 1976 and 1982, when oil embargoes cut the country off from imported crude. In 2024 I came back with medium and large format cameras to see it: the plant, the Highveld grassland around it, and the people who live in Secunda and Embalenhle, within sight of the works. The coal seams are finite, and the plant will one day be wound down. These photographs are of a place still at work.'
  } else if (slug === 'pyrenees') {
    description =
      'In July 2021, my wife and I embarked on a new challenge: 400 kilometers of hiking along the Haute Route of the Pyrenees (HRP), a path that winds through the highest peaks of this relatively young mountain range. Over the span of 20 days, it was just the two of us, immersed in the raw beauty of the Pyrenees. The Pyrenees, especially the HRP, is still a wild and rugged path, where you can walk for hours, sometimes several days, without encountering anyone.'
  } else {
    description = ''
  }
  return description
}
