export async function getAllUsers() {
  const response = await fetch("/api/users/");
  const data = await response.json();
  return data;
}

export async function getAllStudents() {
  const response = await fetch("/api/users/students");
  const data = await response.json();
  return data;
}

export async function getAllTeachers(): Promise<GetAllTeachersResponse> {
  const response = await fetch("/api/users/teachers", {
    credentials: "include",
  });
  const data = await response.json();
  return data;
}
