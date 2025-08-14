'use client';

import React from "react";
import { loadCldr, L10n, setCulture } from "@syncfusion/ej2-base";
import { CalendarComponent } from "@syncfusion/ej2-react-calendars";

// Import CLDR JSON files
import * as numberingSystems from "../../../public/translations/cldr-data/supplemental/numberingSystems.json";
import * as gregorian from "../../../public/translations/cldr-data/main/es/ca-gregorian.json";
import * as numbers from "../../../public/translations/cldr-data/main/es/numbers.json";
import * as timeZoneNames from "../../../public/translations/cldr-data/main/es/timeZoneNames.json";

// Load CLDR data
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);

// Load Spanish localization
L10n.load({
    es: {
        schedule: {
            day: "Día",
            week: "Semana",
            workWeek: "Semana laboral",
            month: "Mes",
            year: "Año",
            agenda: "Agenda",
            weekAgenda: "Agenda de la semana",
            workWeekAgenda: "Agenda de la semana laboral",
            monthAgenda: "Agenda del mes",
            today: "Hoy",
            noEvents: "No hay eventos",
            emptyContainer: "No hay eventos programados para este día.",
            allDay: "Todo el dia",
            start: "Inicio",
            end: "Fin",
            more: "más",
            close: "Cerrar",
            cancel: "Cancelar",
            noTitle: "(Sin título)",
            delete: "Borrar",
            deleteEvent: "Este evento",
            deleteMultipleEvent: "Eliminar Varios eventos",
            selectedItems: "Elementos seleccionados",
            deleteSeries: "Serie completa",
            edit: "Editar",
            editSeries: "Serie completa",
            editEvent: "Este evento",
            createEvent: "Crear",
            subject: "Asunto",
            addTitle: "Añadir título",
            moreDetails: "Más detalles",
            save: "Guardar",
            editContent:
                "¿Cómo le gustaría cambiar la cita en la serie?",
            deleteContent:
                "¿Está seguro de que desea eliminar este evento?",
            deleteMultipleContent:
                "¿Estás seguro de que deseas eliminar los eventos seleccionados?",
            newEvent: "Nuevo evento",
            title: "Título",
            location: "Ubicación",
            description: "Descripción",
            timezone: "Zona horaria",
            startTimezone: "Iniciar zona horaria",
            endTimezone: "Fin de la zona horaria",
            repeat: "Repetir",
            saveButton: "Guardar",
            cancelButton: "Cancelar",
            deleteButton: "Eliminar",
            recurrence: "Repetición",
            wrongPattern: "El patrón de recurrencia no es válido.",
            seriesChangeAlert:
                "¿Desea cancelar los cambios realizados en instancias específicas de esta serie y volver a compararlos con toda la serie?",
            createError:
                "La duración del evento debe ser más corta que la frecuencia con la que ocurre. Acorte la duración o cambie el patrón de periodicidad en el editor de eventos de periodicidad.",
            sameDayAlert:
                "Dos ocurrencias del mismo evento no pueden ocurrir en el mismo día.",
            occurenceAlert:
                "No se puede reprogramar una aparición de la cita periódica si omite una aparición posterior de la misma cita.",
            editRecurrence: "Editar periodicidad",
            repeats: "Repite",
            alert: "Alerta",
            startEndError:
                "La fecha de finalización seleccionada se produce antes de la fecha de inicio.",
            invalidDateError:
                "El valor de la fecha ingresada no es válido.",
            blockAlert:
                "Los eventos no se pueden programar dentro del rango de tiempo bloqueado.",
            ok: "De acuerdo",
            yes: "si",
            no: "No",
            occurrence: "Ocurrencia",
            series: "Serie",
            previous: "Anterior",
            next: "próximo",
            timelineDay: "Día de la línea de tiempo",
            timelineWeek: "Semana de la línea de tiempo",
            timelineWorkWeek: "Cronograma Semana Laboral",
            timelineMonth: "Mes de la línea de tiempo",
            timelineYear: "Cronología Año",
            editFollowingEvent: "Siguientes eventos",
            deleteTitle: "Eliminar evento",
            editTitle: "Editar evento",
            beginFrom: "Comenzar desde",
            endAt: "Fin en",
            expandAllDaySection: "Expandir la sección de todo el día",
            collapseAllDaySection:
                "Contraer sección de todo el día",
            searchTimezone: "Zona horaria de búsqueda",
            noRecords: "No se encontraron registros",
        },
        recurrenceeditor: {
            none: "Ninguna",
            daily: "Diario",
            weekly: "Semanal",
            monthly: "Mensual",
            month: "Mes",
            yearly: "Anual",
            never: "Nunca",
            until: "Hasta",
            count: "Contar",
            first: "Primero",
            second: "Segundo",
            third: "Tercero",
            fourth: "Cuarto",
            last: "Último",
            repeat: "Repetir",
            repeatEvery: "Repite cada",
            on: "Repetir en",
            end: "Final",
            onDay: "Día",
            days: "Día(s)",
            weeks: "Semana(s)",
            months: "Mes(es)",
            years: "Año(s)",
            every: "cada",
            summaryTimes: "vece(s)",
            summaryOn: "en",
            summaryUntil: "hasta",
            summaryRepeat: "Repite",
            summaryDay: "día(s)",
            summaryWeek: "semana(s)",
            summaryMonth: "mes(es)",
            summaryYear: "año(s)",
            monthWeek: "Mes Semana",
            monthPosition: "Posición del mes",
            monthExpander: "Expansor de mes",
            yearExpander: "Expansor de año",
            repeatInterval: "Intervalo de repetición",
        },
        calendar: {
            today: "Hoy",
        },
    },
});

// Set culture to Spanish globally
setCulture("es");

export default function SpanishCalendar() {
    return(
        <CalendarComponent id="es-calendar" locale="es" />
    );
}