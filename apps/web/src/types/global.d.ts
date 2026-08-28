type APIResponse<T = null> = {
  success: boolean;
  data?: T;
  status?: number;
};

type FlattenedAttendanceRecords = {
  studentId: string;
  date: string;
  status: "present" | "absent";
}[];

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

type TeachersData = {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  roles: ("teacher" | "student" | "admin")[];
  createdAt: string;
}[];

type GetAllTeachersResponse = APIResponse<TeachersData>;

type SubjectsData = {
  id: string;
  subjectName: string;
  teacherId: string;
  createdAt: string;
  schedules: {
    id: string;
    subjectId: string;
    dayOfWeek: number;
  }[];
  teacher: {
    id: string;
    email: string;
    username: string;
    roles: ("teacher" | "student" | "admin")[];
    firstName: string | null;
    lastName: string | null;
    createdAt: string;
    updatedAt: string;
  };
}[];

type SingleSubjectData = {
  id: string;
  subjectName: string;
  createdAt: string;
  updatedAt: string;
};

type SingleSubjectOfferingData = {
  id: string;
  subjectId: string;
  teacherId: string;
  startDate: string;
  endDate: string;
  createdAt: Date;
  updatedAt: Date;
  subject: {
    subjectName: string;
  };
  schedules: {
    id: string;
    subjectOfferingId: string;
    dayOfWeek: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

type SubjectOfferingData = SingleSubjectOfferingData[];

type SubjectOfferingResponse = APIResponse<SubjectOfferingData>;

type GetSingleSubjectResponse = APIResponse<SingleSubjectData>;

type GetAllSubjectsResponse = APIResponse<SubjectsData>;
