import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/auth";

function useAuth() {
  const query = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  return {
    user: query.data?.user ?? null,
    isAuthenticated: !!query.data?.user,
    isLoading: query.isLoading,
  };
}

export default useAuth;
