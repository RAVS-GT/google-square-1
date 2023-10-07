// CONSTANTS
export const MINUTE_WIDTH = 2;
export const SNAP_INTERVAL = 5 * MINUTE_WIDTH;
export const DRAG_THRESHOLD = 0.7;

// HELPER FUNCTIONS
export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const getHours = (time) => {
    const [hours] = time.split(":").map(Number);
    return hours;
    };

export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins < 10 ? "0" : ""}${mins}`;
};

export const getMovementInPixels = (deltaX) => {
  const percentageDragged = (deltaX % SNAP_INTERVAL) / SNAP_INTERVAL;
  return percentageDragged >= DRAG_THRESHOLD ||
    percentageDragged <= -DRAG_THRESHOLD
    ? Math.ceil(deltaX / SNAP_INTERVAL) * SNAP_INTERVAL
    : Math.floor(deltaX / SNAP_INTERVAL) * SNAP_INTERVAL;
};

export const calculateX = (start) => {
    const startMinutes = timeToMinutes(start);
    return startMinutes * MINUTE_WIDTH;
};