import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { login, logout } from "../../api/auth";
import useAuth from "../../hooks/useAuth";
const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading, user } = useAuth();
  console.log('Is authenticated is', isAuthenticated);
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
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
        <button
          onClick={() => logoutMutation.mutate()}
          className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-3 py-2 border border-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
          />
          <button
            type="submit"
            className="w-full py-2 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
