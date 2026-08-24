import Calendar from "./Calendar";
import CalendarProvider from "./CalendarProvider";

const AttendanceHome = () => {
  return (
    <div>
      <CalendarProvider>
        <Calendar />
      </CalendarProvider>
    </div>
  );
};

export default AttendanceHome;
