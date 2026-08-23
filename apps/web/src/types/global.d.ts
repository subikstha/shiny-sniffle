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
  roles: string[];
  createdAt: string;
}[];

type GetAllTeachersResponse = APIResponse<TeachersData>;

type SubjectsData = {
  id: string;
  subjectName: string;
  teacherId: string;
  createdAt: string;
}[];

type GetAllSubjectsResponse = APIResponse<SubjectsData>;
