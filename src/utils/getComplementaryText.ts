export const getComplementaryText = (slug: string): string => {
    let complementaryText;
    if (slug === '7-rad') {
        complementaryText = "After diving into satellite data of the NASA/NOAA VIIRS mission, I confirmed that the Netherlands has the highest amounts of artificial light at night (ALAN) of any place in the world. It also has the highest average ALAN of any OECD countries. Measured in radiance (rad), the satellite measured a peak pollution of 10.500 rad close to a village in the center of the Netherlands1. The average in the Netherlands is 7 rad. ALAN has proven to affect the circadian rhythm and amounts of melatonin in the human body. Changes in melatonin have been linked to increase risks for cancer."
    }
    else if (slug === 'pyrenees') {
        complementaryText = "Traveling with analog photography equipment also reminded us of the importance, rarity, and difficulty of slowing down today. The photographic project, combined with the challenging terrain, forced us to go with the elements. This project aims to inspire and invite the viewer to slow down, and through adventure and nature, to reconnect with the wild and healing force within us."
    }
    else {
        complementaryText = "I mainly use a CAMBO camera to capture these sites, which allows me to represent architecture and industry with unparalleled precision. This specialized equipment enables me to capture perfectly straight lines and avoid any deformations caused by perspective or lenses. By doing so, I ensure that the true form and grandeur of industrial structures are faithfully rendered, preserving their inherent beauty and complexity. Through my lens, I aim to convey the quiet elegance and meticulous craftsmanship that define industrial architecture"
    }
    return complementaryText;
}