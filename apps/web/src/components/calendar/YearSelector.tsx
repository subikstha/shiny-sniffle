import React, { useContext } from "react"
import { calendarContext } from "./CalendarProvider"

function YearSelector() {
    const { state, dispatch } = useContext(calendarContext)
    const currentYear = state.today.getFullYear();
    const years = Array.from({ length: 10 }, (_, index) => (currentYear - 9) + index)
    return <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => dispatch({ type: 'setYear', payload: e.target.value })}>
        {years.map((y) => <option key={y} selected={currentYear == y}>{y}</option>)}
    </select>
}

export default YearSelector