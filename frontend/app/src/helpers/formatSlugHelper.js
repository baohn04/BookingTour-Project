function formatSlug(str) {
    if (!str) return 'Unknown';
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export default formatSlug;