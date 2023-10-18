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

  let lastColor = null;
  
export const getColor=()=>{
  
      const colors=["#ff1d58","#f75990","#fff685","#00DDFF","#0049B7"];
      //randomly get a color from the list. make sure no two adjacent shifts have the same color
      let color = colors[Math.floor(Math.random() * colors.length)];
      while(color === lastColor){
          color = colors[Math.floor(Math.random() * colors.length)];
      }
      lastColor = color;
      return color;
  }

export const makeShift = (start, end) => {
  const correctTime = (time) => {
  //   if(getHours(time) < 10) {
  //     return'0'+time;
  // }
    return time;
  }
  const color = getColor();
  start=correctTime(start)
  end=correctTime(end)
  return {
    start,
    end,
    color,
    x: timeToMinutes(start) * MINUTE_WIDTH  };
}

export function uniqueId() {
  return Math.floor(Math.random() * Date.now());
 }

 //date to ISOSTRING
  export const dateToISO = (date) => {
    console.log(date)
    return date.toISOString().split("T")[0];
  }
 

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

//changing time in minutes to multiple of 5
export const snapToGrid = (x) => {
  return Math.round(x / 5) * 5;
};

export const calculateX = (start) => {
    const startMinutes = timeToMinutes(start);
    return startMinutes * MINUTE_WIDTH;
};