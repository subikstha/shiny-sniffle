interface Props {
  buttonClasses?: string;
}
const AttendanceCell = ({ buttonClasses }: Props) => {
  //   const handleClick = () => {};
  return (
    <button className={`${buttonClasses} bg-red-700 text-white`}>Absent</button>
  );
};

export default AttendanceCell;
