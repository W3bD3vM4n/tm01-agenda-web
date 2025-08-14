'use client';

import React from "react";
import {
    ScheduleComponent,
    Week,
    Inject,
    ViewsDirective,
    ViewDirective,
    EventSettingsModel,
    EventRenderedArgs
} from "@syncfusion/ej2-react-schedule";
import { appData } from "@/app/datasource";

export default function SpanishSchedule() {
    const eventSettings: EventSettingsModel = { dataSource: appData };

    const onEventRendered = (args: EventRenderedArgs): void => {
        // Apply the CategoryColor to the event element
        if (args.data.CategoryColor) {
            args.element.style.backgroundColor = args.data.CategoryColor;
        }
    };

    return (
        <>
            <ScheduleComponent
                width='100%'
                height='550px'
                selectedDate={new Date(2018, 1, 15)}
                eventSettings={eventSettings}
                eventRendered={onEventRendered}
            >
                <ViewsDirective>
                    <ViewDirective option='Week' />
                </ViewsDirective>
                <Inject services={[Week]} />
            </ScheduleComponent>
        </>
    )
}