import { useQuery, useMutation } from "@tanstack/react-query";
import { days } from "../../constants";
import { getAllTeachers } from "../../api/users";
import type React from "react";
import { createSubjectOffering, getSingleSubject } from "../../api/subject";

interface Props {
  subjectId: string;
}

// TODO: Need to fetch the teacher from the backend
const SubjectOffering = ({ subjectId }: Props) => {
  // TODO: List all the available subjects with their respective teachers
  // Add a modal with form when admin clicks add subject
  // const queryClient = useQueryClient();
  const { isLoading: isTeachersLoading, data: teachersData } = useQuery({
    queryKey: ["get-teachers"],
    queryFn: () => getAllTeachers(),
    staleTime: 30000,
  });

  const { isLoading: isSubjectLoading, data: subjectData } = useQuery({
    queryKey: ["get-single-subject"],
    queryFn: () => getSingleSubject(subjectId),
    staleTime: 30000,
  });

  const mutation = useMutation({
    mutationFn: ({
      subjectId,
      teacherId,
      daysOfWeek,
      startDate,
      endDate,
    }: {
      subjectId: string;
      teacherId: string;
      daysOfWeek: number[];
      startDate: string;
      endDate: string;
    }) =>
      createSubjectOffering(
        subjectId,
        teacherId,
        startDate,
        endDate,
        daysOfWeek,
      ),
    // onSuccess: async () => {
    //   await queryClient.invalidateQueries({
    //     queryKey: ["get-subjects"],
    //   });
    // },
  });

  const { data: subject } = subjectData || {};
  const { data: allTeachers } = teachersData || {};
  console.log("All subjects", subject);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    // Extract single fields
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const teacherId = formData.get("teacher") as string;
    // Extract all checked days into an array of numbers: [1, 3, 5]
    const daysOfWeek = formData.getAll("days").map((val) => Number(val));
    console.log("start and end dates", startDate, endDate, daysOfWeek);
    mutation.mutate(
      {
        subjectId,
        teacherId,
        startDate,
        endDate,
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
      <div className="mb-4">
        {isSubjectLoading ? (
          <div>Subjects Loading...</div>
        ) : (
          <h1 className="text-2xl font-bold">{subject?.subjectName}</h1>
        )}
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
        <div className="flex gap-6">
          <div className="flex flex-col flex-1">
            <label htmlFor="teacher" className="mb-2 font-semibold">
              Select Teacher
            </label>
            {isTeachersLoading ? (
              <div>Loading Teachers...</div>
            ) : allTeachers && allTeachers.length > 0 ? (
              <select
                name="teacher"
                id="teacher"
                className="border p-2 rounded-lg"
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
          <div className="flex flex-col gap-2">
            <label htmlFor="startDate" className="font-bold">
              Subject Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="border p-2 rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="endDate" className="font-bold">
              Subject End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="border p-2 rounded-lg"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-lg bg-orange-500 text-white hover:bg-orange-600 py-3 cursor-pointer"
        >
          {mutation.isPending
            ? "Creating Subject Offering..."
            : "Create Subject Offering"}
        </button>
      </form>
      {mutation.isError && (
        <p className="text-red-500 text-sm">
          Failed to create subject offering. Please try again.
        </p>
      )}
    </div>
  );
};

export default SubjectOffering;
