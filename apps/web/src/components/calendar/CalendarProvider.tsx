import React, { createContext, useReducer } from "react";

type AttendanceRecords = {
  studentId: string;
  attendances: {
    date: string;
    status: "present" | "absent";
  }[];
}[];

type CalendarState = {
  today: Date;
  year: number;
  month: number;
  subjectOfferings: SubjectOfferingData | null;
  selectedSubjectOfferingId: string;
  attendanceRecords:
    | {
        studentId: string;
        attendances: {
          date: string;
          status: "present" | "absent";
        }[];
      }[]
    | null;
};

type CalendarAction =
  | {
      type: "setYear";
      payload: number;
    }
  | {
      type: "setMonth";
      payload: number;
    }
  | {
      type: "setToday";
      payload: Date;
    }
  | {
      type: "setSubjectOfferingId";
      payload: string;
    }
  | {
      type: "setAllSubjectOfferings";
      payload: SubjectOfferingData;
    }
  | {
      type: "setAttendanceRecords";
      payload: AttendanceRecords;
    }
  | {
      type: "toggleAttendance";
      payload: {
        studentId: string;
        date: string;
      };
    };

function calendarReducer(state: CalendarState, action: CalendarAction) {
  switch (action.type) {
    case "setYear":
      return {
        ...state,
        year: action.payload,
      };
    case "setMonth":
      return {
        ...state,
        month: action.payload,
      };
    case "setToday":
      return {
        ...state,
        today: action.payload,
      };
    case "setSubjectOfferingId":
      return {
        ...state,
        selectedSubjectOfferingId: action.payload,
      };
    case "setAllSubjectOfferings":
      return {
        ...state,
        subjectOfferings: action.payload,
      };
    case "setAttendanceRecords":
      return {
        ...state,
        attendanceRecords: action.payload,
      };
    case "toggleAttendance": {
      const { studentId, date } = action.payload;

      return {
        ...state,

        attendanceRecords:
          state.attendanceRecords?.map((record) => {
            if (record.studentId !== studentId) {
              return record;
            }

            return {
              ...record,

              attendances: record.attendances.map((attendance) => {
                if (attendance.date !== date) {
                  return attendance;
                }

                return {
                  ...attendance,
                  status: attendance.status === "absent" ? "present" : "absent",
                };
              }),
            };
          }) ?? null,
      };
    }
  }
}

const initialCalendarState = {
  today: new Date(),
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  attendanceRecords: null,
  selectedSubjectOfferingId: "",
  subjectOfferings: null,
};

export const calendarContext = createContext(
  null as unknown as {
    state: CalendarState;
    dispatch: (action: CalendarAction) => void;
  },
);

function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(calendarReducer, initialCalendarState);
  return (
    <calendarContext.Provider value={{ state, dispatch }}>
      {children}
    </calendarContext.Provider>
  );
}

export default CalendarProvider;
