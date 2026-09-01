export const getDescription = (slug: string): string => {
  let description: string
  if (slug === '7-rad') {
    description =
      '"When I think of the starry night, I think of a vacation in France." A cyclist in the Westland said this to me — the region locals call the Glass City, whose greenhouses help make the Netherlands the world\'s second-largest agricultural exporter. I moved back to the Netherlands in 2020, during a mentorship with Magnum Photos, and it was the countryside, not any city, that struck me as impossibly bright at night. This is a nation that has spent centuries engineering its land against water, diking and draining field by field; today that same precision keeps greenhouses lit and warm through the winter, so the growing season never has to end. 7 Rad is my attempt to look directly at that light.'
  } else if (slug === 'pyrenees') {
    description =
      'In July 2021, my wife and I embarked on a new challenge: 400 kilometers of hiking along the Haute Route of the Pyrenees (HRP), a path that winds through the highest peaks of this relatively young mountain range. Over the span of 20 days, it was just the two of us, immersed in the raw beauty of the Pyrenees. The Pyrenees, especially the HRP, is still a wild and rugged path, where you can walk for hours, sometimes several days, without encountering anyone.'
  } else {
    description = ''
  }
  return description
}
