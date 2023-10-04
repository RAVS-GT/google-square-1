const formatHour = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };
  
  const Timeline = () => (
    <div className="timeline">
      {Array(24).fill().map((_, hour) => (
        <div key={hour} className="hour-marker">{formatHour(hour)}</div>
      ))}
    </div>
  );
  
  export default Timeline