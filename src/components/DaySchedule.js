import React, { useState } from "react";
import Draggable from "react-draggable";
import styles from  "../styles/scheduler.module.css";
import "react-resizable/css/styles.css";
import useHorizontalScroll from "./HorizontalScroll";
import Timeline from "./Timeline";
import ShiftForm from "./ShiftForm";
import { timeToMinutes, minutesToTime, getMovementInPixels, MINUTE_WIDTH, makeShift, snapToGrid, } from "./functions";
import Datepicker from "react-tailwindcss-datepicker";



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


export default function DaySchedule({ initialShifts, employee }) {
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
    return {...targetShift, ...updates}
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
    setSelectedShift(null);
    const deltaX = getMovementInPixels(data.x - currentShift.x);
    const movementInMinutes = Math.round(deltaX / MINUTE_WIDTH);

    if (!checkOverlap(currentShift, deltaX)) {
      const newStart = timeToMinutes(currentShift.start) + movementInMinutes;
      const newEnd = timeToMinutes(currentShift.end) + movementInMinutes;

      // Update the state with the new times and new X position
      const newShift=updateShift(currentShift, {
        start: minutesToTime(newStart),
        end: minutesToTime(newEnd),
        x: currentShift.x + deltaX
      });

      console.log(newShift)

      setSelectedShift(newShift);
    }
  };

  const handleDelete = (deletedShift) => {
    setShifts(prevShifts => prevShifts.filter(shift => shift !== deletedShift));
  };


  const [selectedShift, setSelectedShift] = useState(null);
  
  const handleShiftClick = (clickedShift) => {
    if(isDragging) return;
    setSelectedShift(null);
    setError("");
    if (selectedShift!=null && selectedShift.start === clickedShift.start) {
      // If the clicked shift is already selected, deselect it
      console.log('deselcting')
      setSelectedShift(null);
    } else {
      // Otherwise, select the clicked shift
        console.log('selecting')
      setSelectedShift(clickedShift);
    }
  };
  

  const scrollRef=useHorizontalScroll();

  const [error, setError] = useState(""); // Use a string state for generic error messages

  const checkOverlapForNewShift = (newShift) => {
    return shifts.some(shift => {
        if (shift === selectedShift) return false;
        const sStart = timeToMinutes(shift.start);
        const sEnd = timeToMinutes(shift.end);
        const nStart = timeToMinutes(newShift.start);
        const nEnd = timeToMinutes(newShift.end);
        return nStart < sEnd && nEnd > sStart;
    });
};


    const handleConfirm = (newShift) => {
      console.log(newShift)

        const isValidTime = (time) => {
            const [hours, minutes] = time.split(":");
            return minutes % 5 === 0;
        };

        // Check if start time is after end time
        if (timeToMinutes(newShift.start) >= timeToMinutes(newShift.end)) {
          console.log(newShift.start, newShift.end)
          console.log(timeToMinutes(newShift.start), timeToMinutes(newShift.end))
            setError("Start time must be before end time.");
            return;
        }

        // Check if the shift duration is less than 15 minutes
        if (timeToMinutes(newShift.end) - timeToMinutes(newShift.start) < 15) {
            setError("Shift duration should be at least 15 minutes.");
            return;
        }

        // Check for overlap with existing shifts
        if (checkOverlapForNewShift(newShift)) {
            setError("The new shift times overlap with another shift.");
            return;
        }

        if(!isValidTime(newShift.start) || !isValidTime(newShift.end)) {
            setError("Shift times must be in 5 minute increments.");
            return;
        }

        // Update the shifts with the new times
        updateShift(selectedShift, {
            start: newShift.start,
            end: newShift.end,
            x: newShift.x,
        })

        // Deselect the shift after confirming and reset error state
        setSelectedShift(null);
        setError("");

        //update to database

    };

    const [isDragging, setIsDragging] = useState(false);

    const eventControl = (event, info) => {


        if (event.type === 'mousemove' || event.type === 'touchmove') {

        setIsDragging(true)

        }

        if (event.type === 'mouseup' || event.type === 'touchend') {
            
        setTimeout(() => {
            setIsDragging(false);

        }, 100);

        }
    }

    const [value, setValue] = useState({ 
      startDate: new Date(), 
      endDate: new Date().setMonth(11) 
      }); 
      const handleValueChange = (newValue) => {
        setValue(newValue); 
      } 
      const today = new Date(); // Gets today's date
      today.setDate(today.getDate() + 30); 


      const [isMouseDragging, setIsMouseDragging] = useState(false);
      const [dragStart, setDragStart] = useState(null);
  
      const handleMouseDown = (e) => {
        setIsMouseDragging(true);
          setDragStart(e.clientX + scrollRef.current.scrollLeft)
      };
  
      const handleMouseUp = (e) => {
          if (isMouseDragging) {
              const dragEnd = e.clientX + scrollRef.current.scrollLeft;
              // Convert dragStart and dragEnd to time values (e.g., "09:00", "11:30")
              const startTime = convertPixelsToTime(dragStart);
              const endTime = convertPixelsToTime(dragEnd);
              const newShift = makeShift(startTime, endTime)

              //write a check to make sure the start time is before the end time and that the shift is at least 15 minutes long
              if(timeToMinutes(endTime) - timeToMinutes(startTime) < 30) {
                console.log('its too short')
                  setIsMouseDragging(false);
                  return;
              }
              if(timeToMinutes(endTime) - timeToMinutes(startTime) > 720) {
                  setIsMouseDragging(false);
                  return;
              }
              // Check for overlap with existing shifts
              if (checkOverlapForNewShift(newShift)) {
                console.log('its fucking overlapping')
                  setIsMouseDragging(false);
                  return;
              }

              // Create a new shift object and add it to the state
              console.log(newShift)
              setShifts(prevShifts => [...prevShifts, newShift]);
              setIsMouseDragging(false);
          }
      };
  
      const convertPixelsToTime = (pixels) => {
        const totalMinutes = snapToGrid(Math.floor(pixels / 2)-20);  // Since MINUTE_WIDTH = 2
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        console.log(`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`)
        
        // Convert hours and minutes to a string format HH:MM
        return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    };

  return (
    <>
    <div className="shadow-md pb-10 pt-5 rounded-md px-5 mx-4 min-h-min"> 
    
    <h1 className="prose prose-xl pb-6">{employee.fullName}</h1>
      

      <div className="w-64 mb-4">
        <Datepicker 
          value={value} 
          onChange={handleValueChange} 
          asSingle={true}
          useRange={false}
          maxDate={today}
        />  
      </div>
        <div className={styles.daySchedule} 
            ref={scrollRef} 
            
        >
        <Timeline />
        <div 
          className={styles.gridContainer}
          onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <GridTable />
            <div className={styles.shiftsLayer}
            >
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
                    onDrag={eventControl}
                    onStop={(e, data) => {
                        handleDragStop(data, shift)
                        eventControl(e, data)
                    }}
                    disabled={selectedShift == null || shift.start != selectedShift.start}
                >
                    <div
                    className={styles.shiftBlock}
                    style={{
                        width: `${widthInMinutes * MINUTE_WIDTH}px`,
                        backgroundColor: shift.color,
                        border: shift.start == selectedShift?.start ? '2px solid blue' : 'none',
                    }}
                    onClick={() => handleShiftClick(shift)}
                    >
                        {shift.start} - {shift.end}
                        <button className={styles.deleteShift} onClick={() => handleDelete(shift)}>X</button>
                    </div>
                </Draggable>
                );
            })}
            </div>
        </div>
        </div>
        <ShiftForm
                    shift={selectedShift==null ? {start:'', end:''} : selectedShift}
                    error={error}
                    onCancel={() => {
                        setSelectedShift(null);
                        setError(""); // Reset the error when cancelling
                    }}          
                    onSubmit={handleConfirm}
                /> 
        </div>  
    </>
  );
}

