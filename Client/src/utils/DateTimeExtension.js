export function formatDate(date) {
    return new Date(date).toLocaleDateString("vi-VN");
}

export function formatTime(dateUtc) {
    const date = new Date(dateUtc);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const diff = date.getTime() - Date.now();
    const absDiff = Math.abs(diff);
    const days = Math.floor(absDiff / 86400000); // 1000*60*60*24
    const hours = Math.floor((absDiff % 86400000) / 3600000);
    const minutes = Math.floor((absDiff % 3600000) / 60000);

    // quá khứ
    if (diff < 0) {
        if (days > 3) {
            return date.toLocaleString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            });
        }
        if (days > 0) return `${days} ngày trước`;
        if (hours > 0) return `${hours} giờ trước`;
        return `${minutes} phút trước`;
    }

    // tương lai
    if (days > 3) {
        return date.toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    }
    if (days > 0) return `Còn ${days} ngày`;
    if (hours > 0) return `Còn ${hours} giờ`;
    return `Còn ${minutes} phút`;
};

export function formatDateTimeFull(date) {
    return new Date(date).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}
export const convertUTCToLocal = (utcInput) => {
    if (!utcInput) return null;

    if (utcInput instanceof Date) {
        return new Date(utcInput);
    }

    // ensure ISO UTC format
    const iso =
        typeof utcInput === "string" && !utcInput.endsWith("Z")
            ? utcInput.replace(" ", "T") + "Z"
            : utcInput;

    return new Date(iso);
};

export const formatSmartTime = (utcDate) => {
    const now = new Date();
    const target = new Date(utcDate);
    const diffMs = target - now;

    const absMs = Math.abs(diffMs);
    const diffMinutes = Math.floor(absMs / (1000 * 60));
    const diffHours = Math.floor(absMs / (1000 * 60 * 60));
    const diffDays = Math.floor(absMs / (1000 * 60 * 60 * 24));

    // >= 3 ngày → datetime
    if (diffDays >= 3) {
        return target.toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: false,
        });
    }

    // < 3 ngày → ngày
    if (diffDays >= 1) {
        return `${diffDays} ngày`;
    }

    // < 24 giờ → giờ
    if (diffHours >= 1) {
        return `${diffHours} giờ`;
    }

    // < 60 phút → phút
    return `${Math.max(diffMinutes, 1)} phút`;
};
