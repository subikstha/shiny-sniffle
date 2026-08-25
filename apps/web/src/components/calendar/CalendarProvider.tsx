import React, { createContext, useReducer } from "react";

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
