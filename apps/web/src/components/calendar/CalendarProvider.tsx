import React, { createContext, useReducer } from "react";

type CalendarState = {
  today: Date;
  year: number;
  month: number;
  allSubjects: SubjectsData | null;
  selectedSubject: string;
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
      type: "setSubject";
      payload: string;
    }
  | {
      type: "setAllSubjects";
      payload: SubjectsData;
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
    case "setSubject":
      return {
        ...state,
        selectedSubject: action.payload,
      };
    case "setAllSubjects":
      return {
        ...state,
        allSubjects: action.payload,
      };
  }
}

const initialCalendarState = {
  today: new Date(),
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  attendanceRecords: null,
  selectedSubject: "",
  allSubjects: null,
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
