import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { days } from "../../constants";
import { getAllTeachers } from "../../api/users";
import type React from "react";
import { createSubject, getAllSubjects } from "../../api/subject";
// TODO: Need to fetch the teacher from the backend
const Subject = () => {
  // TODO: List all the available subjects with their respective teachers
  // Add a modal with form when admin clicks add subject
  const queryClient = useQueryClient();
  const { isLoading: isTeachersLoading, data: teachersData } = useQuery({
    queryKey: ["get-teachers"],
    queryFn: () => getAllTeachers(),
    staleTime: 30000,
  });

  const { isLoading: isSubjectsLoading, data: subjectsData } = useQuery({
    queryKey: ["get-subjects"],
    queryFn: () => getAllSubjects(),
    staleTime: 30000,
  });

  const mutation = useMutation({
    mutationFn: ({
      subjectName,
      daysOfWeek,
      teacherId,
    }: {
      subjectName: string;
      daysOfWeek: number[];
      teacherId: string;
    }) => createSubject(subjectName, daysOfWeek, teacherId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["get-subjects"],
      });
    },
  });

  const { data: allSubjects } = subjectsData || {};
  const { data: allTeachers } = teachersData || {};

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    // Extract single fields
    const subjectName = formData.get("name") as string;
    const teacherId = formData.get("teacher") as string;

    // Extract all checked days into an array of numbers: [1, 3, 5]
    const daysOfWeek = formData.getAll("days").map((val) => Number(val));
    mutation.mutate(
      {
        subjectName,
        teacherId,
        daysOfWeek,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  }

  return (
    <div>
      <div>
        <h2 className="mb-4 text-2xl">All Subjects</h2>
        {isSubjectsLoading ? (
          <div>Subjects Loading...</div>
        ) : (
          <ul>
            {allSubjects?.map((subject) => (
              <li key={subject.id}>{subject.subjectName}</li>
            ))}
          </ul>
        )}
      </div>
      <h2 className="my-4 text-2xl">Create Subject</h2>
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
            disabled={mutation.isPending}
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
                  disabled={mutation.isPending}
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
              disabled={mutation.isPending}
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
          disabled={mutation.isPending}
          className="rounded-lg bg-orange-500 text-white hover:bg-orange-600 py-3 cursor-pointer"
        >
          {mutation.isPending ? "Creating Subject..." : "Create Subject"}
        </button>
      </form>
      {mutation.isError && (
        <p className="text-red-500 text-sm">
          Failed to create subject. Please try again.
        </p>
      )}
    </div>
  );
};

export default Subject;
