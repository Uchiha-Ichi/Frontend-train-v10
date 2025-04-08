import moment from "moment";
import styles from "./Calendar.module.scss";
import "rc-calendar/assets/index.css";
import RcCalendar from "rc-calendar";
import { useState } from "react";
export default function Calendar({ onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(moment());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date.format("YYYY-MM-DD");
    // console.log("Selected date:", formattedDate);
    onDateChange(formattedDate);
  };

  return (
    <div className={styles.calendar}>
      <h2>Ngày khởi hành: {selectedDate.format("DD-MM-YYYY")}</h2>
      <RcCalendar onChange={handleDateChange} className={styles.rcCalendar} />
    </div>
  );
}
