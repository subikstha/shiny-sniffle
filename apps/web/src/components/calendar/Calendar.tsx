import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "../../api/users";
import { calendarContext } from "./CalendarProvider";
import { useContext } from "react";
import YearSelector from "./YearSelector";
import MonthSelector from "./MonthSelector";
import SubjectSelector from "./SubjectSelector";
import AttendanceCell from "./AttendanceCell";
interface AllStudents {
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }[];
}

function Calendar() {
  const { state, dispatch } = useContext(calendarContext);
  const activeDays =
    state.subjectOfferings && state.selectedSubjectOfferingId
      ? state.subjectOfferings
          .find((subject) => subject.id === state.selectedSubjectOfferingId)
          ?.schedules.map((sc) => sc.dayOfWeek)
      : [];
  console.log(
    "Active days",
    activeDays,
    state.subjectOfferings,
    state.selectedSubjectOfferingId,
  );
  const isAnActiveDay = (date: Date) =>
    activeDays && activeDays.length > 0 && activeDays.includes(getDay(date));
  console.log("Active days", activeDays);
  // Fetch all the students
  const { isLoading, data } = useQuery<AllStudents>({
    queryKey: ["allStudents"],
    queryFn: () => getAllStudents(),
    staleTime: 300000,
  });

  const allStudents = data?.data ?? [];

  // Date logic
  const dates = eachDayOfInterval({
    start: startOfMonth(new Date(state.year, state.month, 1)),
    end: endOfMonth(new Date(state.year, state.month, 1)),
  });
  console.log("All dates are", dates);

  if (isLoading) return <div>Loading Data...</div>;

  return (
    <div>
      <div className="flex mb-4 justify-between">
        <YearSelector />
        <SubjectSelector />
        <MonthSelector />
      </div>
      <table className="table-fixed w-full border border-gray-300 [&_td]:px-2 [&_td]:py-4">
        <tbody>
          <tr>
            {/* Auto-fit column with right border separator */}
            <td className="align-top w-1/6 whitespace-nowrap border-r border-gray-300 p-0!">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <td className="font-bold">Students</td>
                  </tr>
                </thead>
                <tbody>
                  {allStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-200">
                      <td>{student.firstName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>

            {/* Remaining space column with scrollable bordered table */}
            <td className="align-top p-0!">
              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      {dates.map((date) => (
                        <td
                          key={date.toISOString()}
                          className="px-4! py-2 whitespace-nowrap border-r border-b border-gray-300"
                        >
                          {format(date, "MMM")} {format(date, "d")} (
                          {format(date, "EEE")}){/* {getDay(date)} */}
                        </td>
                      ))}
                    </tr>
                    {allStudents.map((student) => (
                      <tr key={student.id}>
                        {dates.map((date) => (
                          <td
                            key={date.toISOString()}
                            className={`whitespace-nowrap border-r border-b border-gray-300 ${isAnActiveDay(date) ? "py-0! px-0!" : "py-2! px-4!"}`}
                          >
                            {activeDays &&
                            activeDays.length > 0 &&
                            activeDays.includes(getDay(date)) ? (
                              <AttendanceCell buttonClasses="w-full h-full cursor-pointer flex py-4 px-4 justify-center" />
                            ) : (
                              <>&nbsp;</>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;
