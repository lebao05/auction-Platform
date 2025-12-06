export function formatDate(date) {
    return new Date(date).toLocaleDateString("vi-VN");
}

export function formatime(date) {
    return new Date(date).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit"
    });
}
export function formatDateTimeFull(date) {
    return new Date(date).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
}