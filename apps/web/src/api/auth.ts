export async function login(email: string, password: string): Promise<LoginAPIResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // is particularly important when your frontend and backend are on different origins
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function logout() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include", // since we are using cookies
  });

  if (!response.ok) throw new Error("Logout Failed");

  return response.json();
}

export async function getMe(): Promise<LoginAPIResponse | null> {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Network response was not ok");
  const data = await response.json();
  console.log("Response in get me", data);
  return data;
}
