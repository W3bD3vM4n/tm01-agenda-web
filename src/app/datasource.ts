import type { TaskResponseDTO } from "@/types/task";
import { parseLocalDateTimeString } from "@/types/task";

export type SyncEvent = {
    Id: number | string;
    Subject: string;
    StartTime: Date;
    EndTime: Date;
    CategoryColor?: string;
    // keep the original backend task if you need it
    _raw?: TaskResponseDTO;
};

// Use the environment variable for the API base URL, but ensure it doesn't include /task
const API_BASE = process.env.NEXT_PUBLIC_API ?? "http://localhost:8080/api";
console.log("API_BASE:", API_BASE);


export async function fetchEvents(start: Date, end: Date): Promise<SyncEvent[]> {
    // 1. Construct the correct URL with the "/between" endpoint
    const url = new URL(`${API_BASE}/task/between`);

    // 2. Add the start and end dates as query parameters.
    //    .toISOString() is the standard format (e.g., "2025-08-01T05:00:00.000Z")
    //    that Spring Boot's `ISO.DATE_TIME` expects.
    url.searchParams.append("startDate", start.toISOString());
    url.searchParams.append("endDate", end.toISOString());

    console.log("Fetching from URL:", url.toString()); // For debugging

    try {
        // 3. Use the newly constructed URL in the fetch call
        const res = await fetch(url.toString(), { cache: "no-store"});
        if (!res.ok) {
            console.error("Failed fetching tasks:", res.status, await res.text());
            return [];
        }

        const tasks: TaskResponseDTO[] = await res.json();

        // Map backend TaskResponseDTO -> SyncEvent (Your existing logic is perfect here)
        const events: SyncEvent[] = tasks.map((t) => ({
            Id: t.id,
            Subject: t.title,
            StartTime: parseLocalDateTimeString(t.startDate) ?? new Date(),
            EndTime: parseLocalDateTimeString(t.endDate) ?? new Date(),
            CategoryColor: t.color ?? undefined,
            _raw: t,
        }));

        return events;
    } catch (err) {
        console.error("Error fetching tasks:", err);
        return [];
    }
}