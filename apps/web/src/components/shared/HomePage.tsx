import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../api/users";
import { getMe } from "../../api/auth";
const HomePage = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["all-users"],
    queryFn: () => getAllUsers(),
    staleTime: 30000,
  });

  const { isLoading: isMeLoading, data: meData } = useQuery({
    queryKey: ["me-data"],
    queryFn: () => getMe(),
    staleTime: 30000,
  });

  if (isLoading) {
    return <div>Loading all users</div>;
  }
  console.log("This is data in home page", data);
  return <div className="text-pink-500">HomePage {JSON.stringify(meData)}</div>;
};

export default HomePage;
