import { useMutation, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { login, logout } from "../../api/auth";
import useAuth from "../../hooks/useAuth";
const Login = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading, user } = useAuth();
  console.log("user", user);
  console.log("isAuthenticated", isAuthenticated);
  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: async (data) => {
      console.log("Response back from the login", data);
      // After successful login, need to tell react query to fetch getMe
      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
    onError: (data) => {
      console.log("Error from the server", data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      console.log("Logout success");
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");
    if (typeof email !== "string" || typeof password !== "string") return;

    mutation.mutate({
      email,
      password,
    });
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isAuthenticated) {
    return (
      <div>
        <h1>Welcome, {user?.email}</h1>
        <button onClick={() => logoutMutation.mutate()}>Logout</button>
      </div>
    );
  }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
