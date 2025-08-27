export interface TaskCreateDTO {
    title: string;
    startDate?: string;
    endDate?: string;
    // relevance: number;
    // energy: number;
    color?: string | null;
    detail?: string | null;
}

export interface TaskResponseDTO {
    id: number;
    title: string;
    startDate?: string;
    endDate?: string;
    // relevance: number;
    // energy: number;
    color?: string | null;
    detail?: string | null;
}

function pad(n: number) {
    return String(n).padStart(2, '0');
}

// local wall time -> "YYYY-MM-DDTHH:mm:ss" (no Z)
export function toLocalDateTimeString(d: Date): string {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T` +
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// "YYYY-MM-DDTHH:mm:ss" -> Date interpreted as local wall time
export function parseLocalDateTimeString(s?: string | null): Date | null {
    if (!s) return null;
    const [datePart, timePart = "00:00:00"] = s.split("T");
    const [y, m, day] = datePart.split("-").map(Number);
    const [hh = 0, mm = 0, ss = 0] = timePart.split(":").map(Number);
    return new Date(y, m - 1, day, hh, mm, ss); // constructs a local Date
}