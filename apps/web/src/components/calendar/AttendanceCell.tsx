import { useContext } from "react";
import { calendarContext } from "./CalendarProvider";

interface Props {
  buttonClasses?: string;
  date: string;
  studentId: string;
  status: "absent" | "present";
}

const AttendanceCell = ({ buttonClasses, date, studentId, status }: Props) => {
  const { dispatch } = useContext(calendarContext);

  const handleClick = () => {
    dispatch({
      type: "toggleAttendance",
      payload: {
        studentId,
        date,
      },
    });
  };

  return (
    <button
      className={`${buttonClasses} ${
        status === "present" ? "bg-green-700" : "bg-red-700"
      } text-white`}
      onClick={handleClick}
    >
      {status === "present" ? "Present" : "Absent"}
    </button>
  );
};

export default AttendanceCell;
