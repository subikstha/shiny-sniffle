import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllStudents } from "../../api/users";
import { calendarContext } from "./CalendarProvider";
import { useContext, useEffect, useMemo } from "react";
import YearSelector from "./YearSelector";
import MonthSelector from "./MonthSelector";
import SubjectSelector from "./SubjectSelector";
import AttendanceCell from "./AttendanceCell";
import { bulkAttendance, getBulkAttendance } from "../../api/attendance";
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
  const mutation = useMutation({
    mutationFn: ({
      subjectOfferingId,
      attendanceRecords,
    }: {
      subjectOfferingId: string;
      attendanceRecords: FlattenedAttendanceRecords;
    }) => bulkAttendance(subjectOfferingId, attendanceRecords),
    onSuccess: async (data) => {
      console.log("Response back from the api", data);
    },
  });
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

  // Fetch the attendance records
  const { isLoading: isAttendanceLoading, data: attendanceData } = useQuery({
    queryKey: ["bulk-attendance-data", state.selectedSubjectOfferingId, state.year, state.month],
    queryFn: () => getBulkAttendance(state.selectedSubjectOfferingId, state.year, state.month),
    staleTime: 300000
  })

  console.log('All attendance data is', attendanceData);

  const allStudents = useMemo(() => data?.data ?? [], [data?.data]);

  // Date logic
  const dates = eachDayOfInterval({
    start: startOfMonth(new Date(state.year, state.month, 1)),
    end: endOfMonth(new Date(state.year, state.month, 1)),
  });
  console.log("All dates are", dates);

  useEffect(() => {
    if (allStudents.length === 0 || !state.selectedSubjectOfferingId) {
      return;
    }

    const selectedOffering = state.subjectOfferings?.find(
      (offering) => offering.id === state.selectedSubjectOfferingId,
    );

    if (!selectedOffering) return;

    const activeDays = selectedOffering.schedules.map(
      (schedule) => schedule.dayOfWeek,
    );

    const dates = eachDayOfInterval({
      start: startOfMonth(new Date(state.year, state.month, 1)),
      end: endOfMonth(new Date(state.year, state.month, 1)),
    });

    const classDates = dates.filter((date) =>
      activeDays.includes(getDay(date)),
    );

    const attendanceRecords = allStudents.map((student) => ({
      studentId: student.id,

      attendances: classDates.map((date) => ({
        date: format(date, "yyyy-MM-dd"),
        status: "absent" as const,
      })),
    }));

    dispatch({
      type: "setAttendanceRecords",
      payload: attendanceRecords,
    });
  }, [
    state.month,
    state.year,
    state.selectedSubjectOfferingId,
    state.subjectOfferings,
    allStudents,
    dispatch,
  ]);
  if (isLoading) return <div>Loading Data...</div>;

  const handleBulkAttendance = () => {
    const attendanceRecords = state.attendanceRecords?.flatMap((rec) =>
      rec.attendances.map((att) => ({
        studentId: rec.studentId,
        date: att.date,
        status: att.status,
      })),
    );

    if (!attendanceRecords) return;

    console.log("Attendance payload", {
      subjectOfferingId: state.selectedSubjectOfferingId,
      attendanceRecords,
    });

    // mutation.mutate({
    //   subjectOfferingId: state.selectedSubjectOfferingId,
    //   attendanceRecords,
    // });
  };

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
                      <td>{`${student.firstName} ${student.lastName}`}</td>
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
                        {dates.map((date) => {
                          const dateString = format(date, "yyyy-MM-dd");

                          const studentRecord = state.attendanceRecords?.find(
                            (record) => record.studentId === student.id,
                          );

                          const attendance = studentRecord?.attendances.find(
                            (record) => record.date === dateString,
                          );
                          return (
                            <td
                              key={date.toISOString()}
                              className={`whitespace-nowrap border-r border-b border-gray-300 ${isAnActiveDay(date) ? "py-0! px-0!" : "py-2! px-4!"}`}
                            >
                              {activeDays &&
                                activeDays.length > 0 &&
                                activeDays.includes(getDay(date)) ? (
                                <AttendanceCell
                                  buttonClasses="w-full h-full cursor-pointer flex py-4 px-4 justify-center"
                                  date={format(date, "yyyy-MM-dd")}
                                  studentId={student.id}
                                  status={attendance?.status ?? "absent"}
                                />
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <button className="border rounded-lg" onClick={handleBulkAttendance}>
        Submit
      </button>
    </div>
  );
}

export default Calendar;
