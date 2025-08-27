import type { TaskResponseDTO, TaskCreateDTO } from "@/types/task";
import { parseLocalDateTimeString, toLocalDateTimeString } from "@/types/task";

export type SyncEvent = {
    Id: number | string;
    Subject: string;
    StartTime: Date;
    EndTime: Date;
    // relevance?: number;
    // energy?: number;
    CategoryColor?: string;
    Description?: string;
    _raw?: TaskResponseDTO;
};

// Don't include /task to API_BASE it avoid duplication below
const API_BASE = process.env.NEXT_PUBLIC_API ?? "http://localhost:8080/api";
console.log("API_BASE:", API_BASE);

// --- READ (GET) ---
export async function fetchEvents(start: Date, end: Date): Promise<SyncEvent[]> {
    // 1. Construct the correct URL with the "/between" endpoint
    const url = new URL(`${API_BASE}/task/between`);

    // 2. Add the start and end dates as query parameters
    //    .toISOString() is the standard format (e.g., "2025-08-01T05:00:00.000Z")
    //    that Spring Boot's `ISO.DATE_TIME` expects
    url.searchParams.append("startDate", start.toISOString());
    url.searchParams.append("endDate", end.toISOString());

    console.log("Fetching from URL:", url.toString());

    try {
        // 3. Use the newly constructed URL in the fetch call
        const res = await fetch(url.toString(), { cache: "no-store"});
        if (!res.ok) {
            console.error("Failed fetching tasks:", res.status, await res.text());
            return [];
        }
        const tasks: TaskResponseDTO[] = await res.json();
        return tasks.map(taskDtoToSyncEvent);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        return [];
    }
}

// --- CREATE (POST) ---
export async function createTask(event: SyncEvent): Promise<TaskResponseDTO | null> {
    const url = `${API_BASE}/task`;
    const body = syncEventToCreateDto(event);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            console.error("Failed to create task:", res.status, await res.text());
            return null;
        }
        return await res.json();
    } catch (err) {
        console.error("Error creating task:", err);
        return null;
    }
}

// --- UPDATE (PUT) ---
export async function updateTask(event: SyncEvent): Promise<TaskResponseDTO | null> {
    const url = `${API_BASE}/task/${event.Id}`;
    const body = syncEventToCreateDto(event);

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            console.error("Failed to update task:", res.status, await res.text());
            return null;
        }
        return await res.json();
    } catch (err) {
        console.error("Error updating task:", err);
        return null;
    }
}

// --- DELETE ---
export async function deleteTask(eventId: number | string): Promise<boolean> {
    const url = `${API_BASE}/task/${eventId}`;
    try {
        const res = await fetch(url, { method: "DELETE" });
        if (!res.ok) {
            console.error("Failed to delete task:", res.status, await res.text());
            return false;
        }
        return true; // Successfully deleted (204 No Content)
    } catch (err) {
        console.error("Error deleting task:", err);
        return false;
    }
}

// --- Helper Functions for Data Mapping ---

// Maps the backend DTO to the format Syncfusion needs
export function taskDtoToSyncEvent(t: TaskResponseDTO): SyncEvent {
    return {
        Id: t.id,
        Subject: t.title,
        StartTime: parseLocalDateTimeString(t.startDate) ?? new Date(),
        EndTime: parseLocalDateTimeString(t.endDate) ?? new Date(),
        // relevance: t.relevance,
        // energy: t.energy,
        CategoryColor: t.color ?? undefined,
        Description: t.detail ?? undefined,
        _raw: t,
    };
}

// Maps a Syncfusion event object to the DTO format the backend expects
export function syncEventToCreateDto(event: SyncEvent): TaskCreateDTO {
    return {
        title: event.Subject,
        startDate: toLocalDateTimeString(event.StartTime),
        endDate: toLocalDateTimeString(event.EndTime),
        // relevance: event.relevance ?? 0,
        // energy: event.energy ?? 0,
        color: event.CategoryColor ?? null,
        detail: event.Description ?? null,
    };
}