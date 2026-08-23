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
