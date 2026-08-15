import { useQuery } from "@tanstack/react-query";
import getAllUsers from "../../api/users";
const HomePage = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["all-users"],
    queryFn: () => getAllUsers(),
    staleTime: 30000,
  });

  if (isLoading) {
    return <div>Loading all users</div>;
  }
  console.log("This is data in home page", data);
  return <div className="text-pink-500">HomePage</div>;
};

export default HomePage;
