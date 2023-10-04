import React, { useState } from "react";
import Draggable from "react-draggable";
import styles from  "../styles/scheduler.module.css";
import "react-resizable/css/styles.css";
import useHorizontalScroll from "./HorizontalScroll";
import Timeline from "./Timeline";

// CONSTANTS
const MINUTE_WIDTH = 3;
const SNAP_INTERVAL = 5 * MINUTE_WIDTH;
const DRAG_THRESHOLD = 0.7;

// HELPER FUNCTIONS
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins < 10 ? "0" : ""}${mins}`;
};

const getMovementInPixels = (deltaX) => {
  const percentageDragged = (deltaX % SNAP_INTERVAL) / SNAP_INTERVAL;
  return percentageDragged >= DRAG_THRESHOLD ||
    percentageDragged <= -DRAG_THRESHOLD
    ? Math.ceil(deltaX / SNAP_INTERVAL) * SNAP_INTERVAL
    : Math.floor(deltaX / SNAP_INTERVAL) * SNAP_INTERVAL;
};

// COMPONENTS

const GridTable = () => (
  <div className={styles.gridTable}>
    {Array(24)
      .fill(undefined)
      .map((_, hour) => (
        <div key={hour} className={styles.gridBlock}></div>
      ))}
  </div>
);

const getBoundsForShift = (currentShift, shifts) => {
  // Find the shifts immediately before and after the current shift
  const sortedShifts = [...shifts].sort(
    (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)
  );
  const currentIndex = sortedShifts.indexOf(currentShift);
  const prevShift = sortedShifts[currentIndex - 1];
  const nextShift = sortedShifts[currentIndex + 1];

  // Calculate left and right boundaries
  const leftBoundary = prevShift
    ? timeToMinutes(prevShift.end) * MINUTE_WIDTH
    : 0;
  const rightBoundary = nextShift
    ? timeToMinutes(nextShift.start) * MINUTE_WIDTH -
      (timeToMinutes(currentShift.end) - timeToMinutes(currentShift.start)) *
        MINUTE_WIDTH
    : 24 * 60 * MINUTE_WIDTH;

  return { left: leftBoundary, right: rightBoundary };
};

const handleWheel = (e) => {
  const container = e.currentTarget;
  container.scrollLeft += e.deltaY;
  e.preventDefault();
};

export default function DaySchedule({ initialShifts }) {
  const [shifts, setShifts] = useState(
    initialShifts.map((shift) => ({
      ...shift,
      x: timeToMinutes(shift.start) * MINUTE_WIDTH
    }))
  );

  const updateShift = (targetShift, updates) => {
    setShifts((prevShifts) => {
      const updatedShifts = prevShifts.map((shift) =>
        shift === targetShift ? { ...shift, ...updates } : shift
      );
      return updatedShifts.sort(
        (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)
      );
    });
  };

  const checkOverlap = (currentShift, deltaX) => {
    const movementInMinutes = Math.round(deltaX / MINUTE_WIDTH);
    const newStart = timeToMinutes(currentShift.start) + movementInMinutes;
    const newEnd = timeToMinutes(currentShift.end) + movementInMinutes;

    return shifts.some((shift) => {
      if (shift === currentShift) return false;
      const sStart = timeToMinutes(shift.start);
      const sEnd = timeToMinutes(shift.end);
      return newStart < sEnd && newEnd > sStart;
    });
  };

  const handleDragStop = (data, currentShift) => {
    const deltaX = getMovementInPixels(data.x - currentShift.x);
    const movementInMinutes = Math.round(deltaX / MINUTE_WIDTH);

    if (!checkOverlap(currentShift, deltaX)) {
      const newStart = timeToMinutes(currentShift.start) + movementInMinutes;
      const newEnd = timeToMinutes(currentShift.end) + movementInMinutes;

      // Update the state with the new times and new X position
      updateShift(currentShift, {
        start: minutesToTime(newStart),
        end: minutesToTime(newEnd),
        x: currentShift.x + deltaX
      });
    }
  };

  const scrollRef=useHorizontalScroll();

  return (
    <div className={styles.daySchedule} ref={scrollRef}>
      <Timeline />
      <div className={styles.gridContainer}>
        <GridTable />
        <div className={styles.shiftsLayer}>
          {shifts.map((shift, index) => {
            const startMinute = timeToMinutes(shift.start);
            const widthInMinutes = timeToMinutes(shift.end) - startMinute;
            const bounds = getBoundsForShift(shift, shifts);

            return (
              <Draggable
                axis="x"
                bounds={{
                  top: 0,
                  left: bounds.left,
                  right: bounds.right,
                  bottom: 0
                }}
                key={index}
                position={{ x: shift.x, y: 0 }}
                onStop={(e, data) => handleDragStop(data, shift)}
              >
                <div
                  className={styles.shiftBlock}
                  style={{
                    width: `${widthInMinutes * MINUTE_WIDTH}px`,
                    backgroundColor: shift.color
                  }}
                ></div>
              </Draggable>
            );
          })}
        </div>
      </div>
    </div>
  );
}
