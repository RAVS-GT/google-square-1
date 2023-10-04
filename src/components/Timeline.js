import styles from  "../styles/scheduler.module.css";

const formatHour = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };
  
  const Timeline = () => (
    <div className={styles.timeline}>
      {Array(24).fill().map((_, hour) => (
        <div key={hour} className={styles.hourMarker}>{formatHour(hour)}</div>
      ))}
    </div>
  );
  
  export default Timeline