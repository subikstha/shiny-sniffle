import { useContext } from "react";
import { calendarContext } from "./CalendarProvider";
import { months } from "../../constants";

function MonthSelector() {
  const { state, dispatch } = useContext(calendarContext);
  return (
    <select
      onChange={(e) => dispatch({ type: "setMonth", payload: +e.target.value })}
      value={state.month}
    >
      {months.map((month, index) => (
        <option key={month} value={index}>
          {month}
        </option>
      ))}
    </select>
  );
}

export default MonthSelector;
