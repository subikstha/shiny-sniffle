import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/auth";

function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const user = data?.data?.user ?? null;

  console.log('Data in useAuth', user)

  return {
    user,
    isAuthenticated: !!user,
    isLoading
  };
}

export default useAuth;
