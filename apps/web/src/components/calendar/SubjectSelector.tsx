import { useContext, useEffect } from "react";
import { calendarContext } from "./CalendarProvider";
import { useQuery } from "@tanstack/react-query";
import { getAllSubjectOfferings } from "../../api/subject";

const SubjectSelector = () => {
  const { isLoading, data: subjectOfferingsData } = useQuery({
    queryKey: ["get-subject-offerings"],
    queryFn: () => getAllSubjectOfferings(),
  });
  const { data: allSubjectOfferings } = subjectOfferingsData || {};
  const { state, dispatch } = useContext(calendarContext);

  useEffect(() => {
    if (!allSubjectOfferings?.length) return;

    dispatch({
      type: "setAllSubjectOfferings",
      payload: allSubjectOfferings,
    });

    const selectedStillExists = allSubjectOfferings.some(
      (so) => so.id === state.selectedSubjectOfferingId,
    );

    if (!selectedStillExists) {
      dispatch({
        type: "setSubjectOfferingId",
        payload: allSubjectOfferings[0].id,
      });
    }
  }, [allSubjectOfferings, dispatch, state.selectedSubjectOfferingId]);

  return isLoading ? (
    <div>Loading Subjects...</div>
  ) : allSubjectOfferings ? (
    <select
      onChange={(e) => {
        console.log("Selected:", e.target.value);
        dispatch({
          type: "setSubjectOfferingId",
          // TODO: maybe just store the id?
          payload: e.target.value,
        });
      }}
      value={state.selectedSubjectOfferingId}
    >
      {allSubjectOfferings.map((so) => (
        <option key={so.id} value={so.id}>
          {so.subject.subjectName}
        </option>
      ))}
    </select>
  ) : (
    <div>No subjects found</div>
  );
};

export default SubjectSelector;
