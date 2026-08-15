type APIResponse<T = null> = {
  success: boolean;
  data?: T;
  status?: number;
};
