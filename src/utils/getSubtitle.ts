export const getSubtitle = (slug: string): string => {
    let subtitle;
    if (slug === '7-rad') {
        subtitle = "7 Rad - Atlas of the Dutch Noctucide is an exploration into the Dutch systemic and systematic eradication of the night sky "
    }
    else if (slug === 'pyrenees') {
        subtitle = "Through rugged landscapes and solitary trails, this project captures the profound stillness and untamed beauty of the Pyrenees, inviting a reconnection with the wild essence within us."
    }
    else {
        subtitle = "Industry is an attempt to explore the fascination on architecture"
    }
    return subtitle;
}