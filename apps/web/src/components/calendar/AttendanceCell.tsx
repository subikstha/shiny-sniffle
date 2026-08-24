interface Props {
  buttonClasses?: string;
}
const AttendanceCell = ({ buttonClasses }: Props) => {
  //   const handleClick = () => {};
  return <button className={buttonClasses}>AttendanceCell</button>;
};

export default AttendanceCell;
