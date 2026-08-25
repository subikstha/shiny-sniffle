type APIResponse<T = null> = {
  success: boolean;
  data?: T;
  status?: number;
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

type SubjectOfferingData = {
  id: string;
  subjectId: string;
  teacherId: string;
  startDate: string;
  endDate: string;
  createdAt: Date;
  updatedAt: Date;
  schedules: {
    id: string;
    subjectOfferingId: string;
    dayOfWeek: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
}[];

type SubjectOfferingResponse = APIResponse<SubjectOfferingData>;

type GetSingleSubjectResponse = APIResponse<SingleSubjectData>;

type GetAllSubjectsResponse = APIResponse<SubjectsData>;
