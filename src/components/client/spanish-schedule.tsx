'use client';

import React from "react";
import { ScheduleComponent, Week, Inject, ViewsDirective, ViewDirective, EventSettingsModel, ResourcesDirective, ResourceDirective } from "@syncfusion/ej2-react-schedule";
import { appData } from "@/app/datasource";

export default function SpanishSchedule() {
    const eventSettings: EventSettingsModel = { dataSource: appData };

    return (
        <>
            <ScheduleComponent width='100%' height='550px' selectedDate={new Date(2018, 1, 15)} eventSettings={eventSettings} >
                <ViewsDirective>
                    <ViewDirective option='Week' />
                </ViewsDirective>
                <Inject services={[Week]} />
            </ScheduleComponent>
        </>
    )
}