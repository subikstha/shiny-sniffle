import { useContext } from "react";
import { calendarContext } from "./CalendarProvider";

const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
function MonthSelector() {
    const { state } = useContext(calendarContext)
    return <select>
        {months.map((month) => <option key={month} selected={months[state.today.getMonth()] == month}>{month}</option>)}
    </select>
}

export default MonthSelector