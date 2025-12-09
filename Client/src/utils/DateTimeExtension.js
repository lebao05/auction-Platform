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

export function formatSmartTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();

    const diffMs = date - now;       // positive = future, negative = past
    const absMs = Math.abs(diffMs);

    const seconds = Math.floor(absMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const isFuture = diffMs > 0;
    const end = (text) => isFuture ? `in ${text}` : `${text} ago`;

    // ---- seconds (< 60s)
    if (seconds < 60) {
        return end(`${seconds} seconds`);
    }

    // ---- minutes + seconds (< 60m)
    if (minutes < 60) {
        const sec = seconds % 60;
        return end(`${minutes} minutes ${sec} seconds`);
    }

    // ---- hours + minutes (< 24h)
    if (hours < 24) {
        const mins = minutes % 60;
        return end(`${hours} hours ${mins} minutes`);
    }

    // ---- days + hours (< 7 days)
    if (days < 7) {
        const hrs = hours % 24;
        return end(`${days} days ${hrs} hours`);
    }

    // ---- 7+ days → full date
    return date.toLocaleString();
}
