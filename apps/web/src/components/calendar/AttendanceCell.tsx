import { useState } from "react";

interface Props {
  buttonClasses?: string;
}
const AttendanceCell = ({ buttonClasses }: Props) => {
  const [attendanceStatus, setAttendanceStatus] = useState<
    "Absent" | "Present"
  >("Absent");
  const handleClick = () => {
    setAttendanceStatus((prev) => {
      if (prev === "Absent") return "Present";
      if (prev === "Present") return "Absent";
    });
  };
  return (
    <button
      className={`${buttonClasses} bg-red-700 text-white`}
      onClick={handleClick}
    >
      {attendanceStatus}
    </button>
  );
};

export default AttendanceCell;
