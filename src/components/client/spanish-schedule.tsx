'use client';

import React, { useEffect, useRef, useState } from "react";
import {
    ScheduleComponent,
    Week,
    Inject,
    ViewsDirective,
    ViewDirective,
    EventSettingsModel,
    ActionEventArgs,
} from "@syncfusion/ej2-react-schedule";
import {createTask, deleteTask, fetchEvents, type SyncEvent, taskDtoToSyncEvent, updateTask} from "@/app/datasource";
import { TaskResponseDTO } from "@/types/task";

function monthKey(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // "YYYY-MM"
}
function monthRangeFromDate(d: Date) {
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    start.setHours(0,0,0,0);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    end.setHours(23,59,59,999);
    return { start, end };
}
function weekRangeFromDates(dates: Date[]) {
    const start = new Date(dates[0]);
    start.setHours(0,0,0,0);
    const end = new Date(dates[dates.length - 1]);
    end.setHours(23,59,59,999);
    return { start, end };
}

// Receive the event data as props
const eventTemplate = (props: SyncEvent) => {
    return (
        <div
            className="w-full h-full p-1"
            style={{
                backgroundColor: props.CategoryColor,
                color: 'black'
            }}
        >
            <div className="font-semibold truncate">{props.Subject}</div>
            <div className="text-xs truncate">{props.Description}</div>
        </div>
    );
};

export default function SpanishScheduleWeeklyButMonthlyFetch() {
    const scheduleRef = useRef<ScheduleComponent | null>(null);
    const [events, setEvents] = useState<SyncEvent[]>([]);
    const [loading, setLoading] = useState(false);

    const cacheRef = useRef<Map<string, SyncEvent[]>>(new Map());
    const fetchPromises = useRef<Map<string, Promise<void>>>(new Map());
    const abortRef = useRef<AbortController | null>(null);

    // --- Data fetching and caching ---
    async function ensureMonths(monthKeys: string[], monthDates: Date[]) {
        const promises: Promise<void>[] = [];

        for (let i = 0; i < monthKeys.length; i++) {
            const key = monthKeys[i];
            if (cacheRef.current.has(key)) continue;

            if (fetchPromises.current.has(key)) {
                promises.push(fetchPromises.current.get(key)!);
                continue;
            }

            const { start, end } = monthRangeFromDate(monthDates[i]);
            const p = (async () => {
                try {
                    const monthEvents = await fetchEvents(start, end);
                    cacheRef.current.set(key, monthEvents);
                } catch (err) {
                    console.error("failed fetching month", key, err);
                } finally {
                    fetchPromises.current.delete(key);
                }
            })();

            fetchPromises.current.set(key, p);
            promises.push(p);
        }

        await Promise.all(promises);
    }

    function showWeekFromCached(start: Date, end: Date) {
        const startMonth = new Date(start);
        const endMonth = new Date(end);

        const keysToRead = new Set<string>();
        let iter = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1);
        while (iter <= endMonth) {
            keysToRead.add(monthKey(iter));
            iter = new Date(iter.getFullYear(), iter.getMonth() + 1, 1);
        }

        const all: SyncEvent[] = [];
        for (const k of keysToRead) {
            const arr = cacheRef.current.get(k);
            if (arr) all.push(...arr);
        }

        const filtered = all.filter(e => {
            const startTime = new Date(e.StartTime);
            const endTime = new Date(e.EndTime);
            // Check if any part of the event falls within the week's range
            return (startTime <= end && endTime >= start);
        });

        setEvents(filtered);
    }

    async function loadForVisibleDates(dates: Date[]) {
        if (!dates || dates.length === 0) return;

        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        const { start, end } = weekRangeFromDates(dates);

        const months: Date[] = [];
        const monthKeys: string[] = [];
        const sKey = monthKey(start);
        months.push(new Date(start.getFullYear(), start.getMonth(), 1));
        monthKeys.push(sKey);

        if (start.getMonth() !== end.getMonth() || start.getFullYear() !== end.getFullYear()) {
            const eKey = monthKey(end);
            if (eKey !== sKey) {
                months.push(new Date(end.getFullYear(), end.getMonth(), 1));
                monthKeys.push(eKey);
            }
        }

        setLoading(true);
        try {
            await ensureMonths(monthKeys, months);

            const prev = new Date(months[0].getFullYear(), months[0].getMonth() - 1, 1);
            const next = new Date(months[months.length - 1].getFullYear(), months[months.length - 1].getMonth() + 1, 1);
            const prefetchDates = [prev, next];

            prefetchDates.forEach(date => {
                const k = monthKey(date);
                if (!cacheRef.current.has(k) && !fetchPromises.current.has(k)) {
                    (async () => {
                        const { start: ps, end: pe } = monthRangeFromDate(date);
                        try {
                            const evs = await fetchEvents(ps, pe);
                            cacheRef.current.set(k, evs);
                        } catch (_) {}
                    })();
                }
            });

            showWeekFromCached(start, end);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timerId = window.setTimeout(() => {
            if (scheduleRef.current) {
                const dates = scheduleRef.current.getCurrentViewDates();
                loadForVisibleDates(dates);
            }
        }, 50); // A small delay to ensure the component is fully rendered
        return () => clearTimeout(timerId);
    }, []);

    // --- Update cache and refresh UI ---
    const updateCacheAndRefresh = (updatedEvent: SyncEvent, action: 'add' | 'update' | 'delete') => {
        const key = monthKey(updatedEvent.StartTime);
        const monthCache = cacheRef.current.get(key);
        if (!monthCache) return; // Should not happen if event was visible

        let newMonthCache: SyncEvent[] = [];
        switch (action) {
            case 'add':
                newMonthCache = [...monthCache, updatedEvent];
                break;
            case 'update':
                newMonthCache = monthCache.map(e => e.Id === updatedEvent.Id ? updatedEvent : e);
                break;
            case 'delete':
                newMonthCache = monthCache.filter(e => e.Id !== updatedEvent.Id);
                break;
        }
        cacheRef.current.set(key, newMonthCache);

        // Refresh the visible events from the updated cache
        if (scheduleRef.current) {
            const dates = scheduleRef.current.getCurrentViewDates();
            const { start, end } = weekRangeFromDates(dates);
            showWeekFromCached(start, end);
        }
    }

    // --- Handle CRUD actions ---
    async function onActionComplete(args: ActionEventArgs) {
        // Handle navigation
        if (args.requestType === "viewNavigate" || args.requestType === "dateNavigate") {
            if (scheduleRef.current) {
                const dates = scheduleRef.current.getCurrentViewDates();
                window.setTimeout(() => loadForVisibleDates(dates), 60);
            }
            return;
        }

        // Handle CRUD
        if (args.requestType === "eventCreated") {
            const newEvent = (args.data as SyncEvent[])[0];
            const createdTaskDto = await createTask(newEvent);
            if (createdTaskDto) {
                updateCacheAndRefresh(taskDtoToSyncEvent(createdTaskDto), "add");
            }
        } else if (args.requestType === "eventChanged") {
            const changedEvent = (args.data as SyncEvent[])[0];
            const updatedTaskDto = await updateTask(changedEvent);
            if (updatedTaskDto) {
                updateCacheAndRefresh(taskDtoToSyncEvent(updatedTaskDto), "update");
            }
        } else if (args.requestType === "eventRemoved") {
            const deletedEvent = (args.data as SyncEvent[])[0];
            const success = await deleteTask(deletedEvent.Id);
            if (success) {
                updateCacheAndRefresh(deletedEvent, "delete");
            }
        }
    }

    const eventSettings: EventSettingsModel = {
        dataSource: events,
        template: eventTemplate,
        // Add fields mapping for the editor window
        fields: {
            id: "Id",
            subject: { name: "Subject", title: "Title" },
            startTime: { name: "StartTime", title: "Start Time" },
            endTime: { name: "EndTime", title: "End Time" },
            description: { name: "Description", title: "Details" },
        }
    };

    return (
        <>
            <ScheduleComponent
                ref={scheduleRef}
                width="100%"
                height="720px"
                selectedDate={new Date(2025, 7, 25)} // Start on a date with events
                eventSettings={eventSettings}
                actionComplete={onActionComplete}
                currentView="Week"
            >
                <ViewsDirective>
                    <ViewDirective option="Week" />
                </ViewsDirective>
                <Inject services={[Week]} />
            </ScheduleComponent>
            {loading && <div className="fixed bottom-2 right-2 p-2 bg-white shadow rounded z-10">Loading...</div>}
        </>
    );
}