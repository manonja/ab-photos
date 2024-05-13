const getProjectSlug = (project: string): string => {
    // Normalize: Remove accents/diacritics in a string in JavaScript
    const normalized = project.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Convert to lowercase, replace spaces with dashes, remove unwanted characters
    return normalized
        .toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with dashes
        .replace(/[^a-z0-9\-]/gi, ''); // Remove all non-alphanumeric characters except dashes
};

export default getProjectSlug;
