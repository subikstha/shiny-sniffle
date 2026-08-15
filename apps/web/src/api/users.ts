export default async function getAllUsers() {
  const response = await fetch("/api/users/");
  const data = await response.json();
  return data;
}
