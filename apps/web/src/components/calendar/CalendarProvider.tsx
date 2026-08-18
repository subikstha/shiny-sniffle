import React, { createContext, useReducer } from "react";

type CalendarState = {
    today: Date,
    year: string;
    month: string;
    attendanceRecords: {
        studentId: string;
        attendances: {
            date: string;
            status: 'present' | 'absent'
        }[]
    }[] | null
}

type CalendarAction = {
    type: 'setYear',
    payload: string
} | {
    type: 'setMonth',
    payload: string
} | {
    type: 'setToday',
    payload: Date
}

function calendarReducer(state: CalendarState, action: CalendarAction) {
    switch (action.type) {
        case 'setYear':
            return {
                ...state,
                year: action.payload
            }
        case 'setMonth':
            return {
                ...state,
                month: action.payload
            }
        case 'setToday':
            return {
                ...state,
                today: action.payload
            }
    }
}

const initialCalendarState = {
    today: new Date(),
    year: '',
    month: '',
    attendanceRecords: null
}
export const calendarContext = createContext(null as unknown as {
    state: CalendarState,
    dispatch: (action: CalendarAction) => void
})

function CalendarProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(calendarReducer, initialCalendarState)
    return <calendarContext.Provider value={{ state, dispatch }}>
        {children}
    </calendarContext.Provider>
}

export default CalendarProvider