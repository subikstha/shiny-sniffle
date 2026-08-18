import { format, isToday, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { useQuery } from "@tanstack/react-query"
import { getAllStudents } from '../../api/users'
import { calendarContext } from './CalendarProvider';
import { useContext } from 'react'
import YearSelector from './YearSelector';
interface AllStudents {
    data: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }[]
}

function Calendar() {
    const { state, dispatch } = useContext(calendarContext);
    // Fetch all the students
    const { isLoading, data } = useQuery<AllStudents>({
        queryKey: ['allStudents'],
        queryFn: () => getAllStudents(),
        staleTime: 300000
    })

    const allStudents = data?.data ?? []

    // Date logic
    const dates = eachDayOfInterval({
        start: startOfMonth(state.today),
        end: endOfMonth(state.today)
    })
    console.log('All dates are', dates);

    if (isLoading) return <div>Loading Data...</div>

    return (<div>
        <div className='flex'>
            <YearSelector />
        </div>
        <table className="table-fixed w-full border border-gray-300 [&_td]:px-2 [&_td]:py-4">
            <tbody>
                <tr>
                    {/* Auto-fit column with right border separator */}
                    <td className="align-top w-1/6 whitespace-nowrap border-r border-gray-300 p-0!">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-gray-300">
                                    <td className="font-bold">Students</td>
                                </tr>
                            </thead>
                            <tbody>
                                {allStudents.map((student) => (
                                    <tr key={student.id} className="border-b border-gray-200">
                                        <td>{student.firstName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </td>

                    {/* Remaining space column with scrollable bordered table */}
                    <td className="align-top p-0!">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full border-collapse">
                                <tbody>
                                    <tr>
                                        {dates.map((date) => (
                                            <td
                                                key={date.toISOString()}
                                                className="px-4! py-2 whitespace-nowrap border-r border-b border-gray-300"
                                            >
                                                {format(date, 'MMM')} {format(date, 'd')}
                                            </td>
                                        ))}
                                    </tr>
                                    {allStudents.map((student) => <tr key={student.id}>
                                        {dates.map((date) => (
                                            <td
                                                key={date.toISOString()}
                                                className="px-4! py-2 whitespace-nowrap border-r border-b border-gray-300"
                                            >
                                                &nbsp;
                                            </td>
                                        ))}
                                    </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table></div>)
}

export default Calendar