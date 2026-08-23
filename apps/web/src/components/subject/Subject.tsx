import { useQuery } from "@tanstack/react-query";
import { days } from "../../constants";
import { getAllTeachers } from "../../api/users";
import type React from "react";
// TODO: Need to fetch the teacher from the backend
const Subject = () => {
  // TODO: List all the available subjects with their respective teachers
  // Add a modal with form when admin clicks add subject
  const { isLoading: isTeachersLoading, data: teachersData } = useQuery({
    queryKey: ["get-teachers"],
    queryFn: () => getAllTeachers(),
    staleTime: 30000,
  });

  const { data: allTeachers } = teachersData || {};

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Extract single fields
    const subjectName = formData.get("name") as string;
    const teacherId = formData.get("teacher") as string;

    // Extract all checked days into an array of numbers: [1, 3, 5]
    const daysOfWeek = formData.getAll("days").map((val) => Number(val));

    const payload = {
      subjectName,
      teacherId,
      daysOfWeek,
    };
    console.log("PAYLOAD", payload);
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl">Create Subject</h2>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 font-semibold">
            Subject Name
          </label>
          <input
            type="text"
            placeholder="Subject Name"
            name="name"
            id="name"
            className="border p-1.5 rounded-lg"
            required
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2 font-semibold">Subject Active Days</span>
          <div>
            {days.map((day) => (
              <div key={day.label} className="flex gap-2">
                <input
                  type="checkbox"
                  id={day.label}
                  name="days"
                  value={day.value}
                />
                <label htmlFor={day.label}>{day.label}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="teacher" className="mb-2 font-semibold">
            Select Teacher
          </label>
          {isTeachersLoading ? (
            <div>Loading Teachers...</div>
          ) : allTeachers && allTeachers.length > 0 ? (
            <select
              name="teacher"
              id="teacher"
              className="border p-1.5 rounded-lg"
            >
              {allTeachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName
                    ? `${teacher.firstName} ${teacher.lastName}`
                    : teacher.username}
                </option>
              ))}
            </select>
          ) : (
            <>Nothing found</>
          )}
        </div>
        <button
          type="submit"
          className="rounded-lg bg-orange-500 text-white hover:bg-orange-600 py-3 cursor-pointer"
        >
          Create Subject
        </button>
      </form>
    </div>
  );
};

export default Subject;
