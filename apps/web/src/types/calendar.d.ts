type AttendanceRecord = {
  studentId: string;
  attendances: {
    date: string;
    status: "present" | "absent";
  }[];
}

type AttendanceRecords = AttendanceRecord[];

type FlattenedAttendanceRecord = {
  studentId: string;
  date: string;
  status: 'present' | 'absent'
}

// type FlattenedAttendanceRecords = FlattenedAttendanceRecord[];

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
