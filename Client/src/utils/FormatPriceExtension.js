export function formatPrice(value) {
    if (value === null || value === undefined || value === '') return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 1000000 -> 1,000,000
}

export function parsePrice(value) {
    if (!value) return 0;
    return parseInt(value.toString().replace(/,/g, '')) || 0;
}
