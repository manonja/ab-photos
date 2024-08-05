export const getDescription = (slug: string): string => {
    let description;
    if (slug === '7-rad') {
        description = "In 2020, I returned to my homeland, the Netherlands, and started a mentorship with Magnum to deepen my exploration of large-format landscape photography. During the winter months, I was struck by the brightness of the Dutch skies at night—surprisingly more luminous than those over megacities like New York and São Paulo where I used to live."
    }
    else if (slug === 'pyrenees') {
        description = "In July 2021, my wife and I embarked on a new challenge: 400 kilometers of hiking along the Haute Route of the Pyrenees (HRP), a path that winds through the highest peaks of this relatively young mountain range. Over the span of 20 days, it was just the two of us, immersed in the raw beauty of the Pyrenees. The Pyrenees, especially the HRP, is still a wild and rugged path, where you can walk for hours, sometimes several days, without encountering anyone."
    }
    else {
        description = "To me, industrial architecture embodies not only progress but also a profound sense of harmony. There is a unique fascination in the beauty that emerges when mathematics, human ingenuity, and raw materials converge, producing results that are both functional and visually captivating. Photographing industrial sites is a meditative process for me, a way to connect deeply with the structures and materials. It feels as if I become one with the matter in front of me, experiencing a profound sense of unity and tranquility."
    }
    return description;
}