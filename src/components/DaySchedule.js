import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import styles from  "../styles/scheduler.module.css";
import "react-resizable/css/styles.css";
import useHorizontalScroll from "./HorizontalScroll";
import Timeline from "./Timeline";
import ShiftForm from "./ShiftForm";
import { timeToMinutes, minutesToTime, getMovementInPixels, MINUTE_WIDTH, makeShift, snapToGrid, uniqueId, dateToISO, } from "./functions";
import Datepicker from "react-tailwindcss-datepicker";
import { api } from "~/utils/api";



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

  const setNewShifts=api.schedule.updateShiftsForDayAndEmployee.useMutation()

  const [date, setDate] = useState({ 
    startDate: (new Date()).toISOString().split("T")[0],
    endDate: new Date().setMonth(11) 
    });

  useEffect(() => {
    getShifts.refetch()
  }, [date])

  const [shifts, setShifts] = useState(
    initialShifts.map((shift) => ({
      ...shift,
      x: timeToMinutes(shift.start) * MINUTE_WIDTH
    }))
  );

  console.log(date.startDate)
  const getShifts=api.schedule.getShiftsByDayAndEmployee.useQuery({day: date.startDate, employeeId: employee.employeeId})

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

      setSelectedShift(newShift);
    }
  };

  const handleDelete = (deletedShift) => {
    setShifts(prevShifts => prevShifts.filter(shift => shift !== deletedShift));
    setTimeout(()=>{setSelectedShift(null)}, 200);
  };


  const [selectedShift, setSelectedShift] = useState(null);
  
  const handleShiftClick = (clickedShift) => {
    if(isDragging) return;
    setSelectedShift(null);
    setError("");
    if (selectedShift!=null && selectedShift.start === clickedShift.start) {
      // If the clicked shift is already selected, deselect it
      setSelectedShift(null);
    } else {
      // Otherwise, select the clicked shift
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

        const isValidTime = (time) => {
            const [hours, minutes] = time.split(":");
            return minutes % 5 === 0;
        };

        // Check if start time is after end time
        if (timeToMinutes(newShift.start) >= timeToMinutes(newShift.end)) {
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

    
      const handleValueChange = (newValue) => {
        setDate(newValue); 
      } 
      const today = new Date(); // Gets today's date
      today.setDate(today.getDate() + 30); 


      const [isMouseDragging, setIsMouseDragging] = useState(false);
      const [dragStart, setDragStart] = useState(null);
      const [toAdd, setToAdd] = useState(false);
      const [isChanged, setChanged] = useState(false);
  
      const handleMouseDown = (e) => {
        if(!toAdd){
          return;
        }
        setIsMouseDragging(true);
          setDragStart(e.clientX + scrollRef.current.scrollLeft)
      };
  
      const handleMouseUp = (e) => {
        if(!toAdd){
          return;
        }
          if (isMouseDragging) {
              const dragEnd = e.clientX + scrollRef.current.scrollLeft;
              // Convert dragStart and dragEnd to time values (e.g., "09:00", "11:30")
              const startTime = convertPixelsToTime(dragStart);
              const endTime = convertPixelsToTime(dragEnd);
              const newShift = makeShift(startTime, endTime)

              //write a check to make sure the start time is before the end time and that the shift is at least 15 minutes long
              if(timeToMinutes(endTime) - timeToMinutes(startTime) < 30) {
                  setIsMouseDragging(false);
                  return;
              }
              if(timeToMinutes(endTime) - timeToMinutes(startTime) > 720) {
                  setIsMouseDragging(false);
                  return;
              }
              // Check for overlap with existing shifts
              if (checkOverlapForNewShift(newShift)) {
                  setIsMouseDragging(false);
                  return;
              }

              // Create a new shift object and add it to the state
              setToAdd(false)
              setShifts(prevShifts => [...prevShifts, newShift].sort(
                (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)
              ));
              setIsMouseDragging(false);
          }
      };
  
      const convertPixelsToTime = (pixels) => {
        const totalMinutes = snapToGrid(Math.floor(pixels / 2)-20);  // Since MINUTE_WIDTH = 2
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        
        // Convert hours and minutes to a string format HH:MM
        return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    };

  // if(getShifts.isLoading){
  //   return(
  //     <div className="shadow-md pb-10 pt-5 rounded-md px-5 mx-4 min-h-min"> 
  //       <div className="flex flex-row pt-10">
  //         <span className="loading loading-spinner loading-md"></span>
  //       </div>
  //     </div>
  //   )
  // }

  useEffect(() => {
    if(getShifts.isSuccess){
      console.log('setting shifts')
      // changed
      // setShifts(getShifts.data.map((shift) => {

      //   const convertFromISO = (startISO, endISO) => {
      //     const startDateTime = new Date(startISO);
      //     const endDateTime = new Date(endISO);
      
      //     const formatTime = (date) => {
      //         const hours = String(date.getUTCHours()).padStart(2, '0');
      //         const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      //         return `${hours}:${minutes}`;
      //     };
      
      //     return {
      //         startTime: formatTime(startDateTime),
      //         endTime: formatTime(endDateTime)
      //     };
      // }
      //   const time=convertFromISO(shift.start_at, shift.end_at)
      //   return makeShift(time.startTime, time.endTime)
      //   }
      // ))
    }
  }, [getShifts.isSuccess])

  const onSave=()=>{
    function convertToISO(startTime, endTime) {
      const currentDate = new Date();
      const currentDateString = currentDate.toISOString().split('T')[0];  // Extracting the date part

      console.log(startTime, endTime)
  
      // Combining the current date with the provided times
      const startDateTime = new Date(`${currentDateString}T${startTime}:00Z`);
      const endDateTime = new Date(`${currentDateString}T${endTime}:00Z`);

      console.log(`${currentDateString}T${startTime}:00Z`, `${currentDateString}T${endTime}:00Z`)
  
      return {
          // startISO: startDateTime.toISOString(),
          // endISO: endDateTime.toISOString()
          startISO: `${currentDateString}T${startTime}:00Z`,
          endISO: `${currentDateString}T${endTime}:00Z`
      };
  }
  
  console.log(shifts)

    setNewShifts.mutate({shifts: shifts.map((shift)=>{
      const { startISO, endISO } = convertToISO(shift.start, shift.end);
      console.log(shift)
      return ({
      start_at:startISO,
      end_at:endISO,
      id: uniqueId().toString(),
    })
  }
    ), day: (date.startDate), employeeId: employee.employeeId})
    getShifts.refetch()
  }


  return (
    <>
    <div className="shadow-md pb-10 pt-5 rounded-md px-5 mx-4 min-h-min"> 
    
    <h1 className="prose prose-xl pb-6">{employee.fullName}</h1>
      

      <div className="flex flex-row space-x-4 items-center mb-4">
        <div className="w-64">
          <Datepicker 
            value={date} 
            onChange={handleValueChange} 
            asSingle={true}
            useRange={false}
            maxDate={today}
          />  
        </div>
        <button className="btn btn-sm btn-outline" onClick={()=>{setToAdd(!toAdd)}}>{toAdd?"Cancel":"Add"}</button>
        <button className="btn btn-sm btn-outline" disabled={setNewShifts.isLoading} onClick={()=>{onSave()}}>{"Save"}</button>
      </div>
        <div className={styles.daySchedule} 
            ref={scrollRef} 
            
        >
        {
          getShifts.isLoading? (
            <div className="flex flex-row pt-10">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ):(
          <div>
            <Timeline />
            <div 
              className={styles.gridContainer}
              onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            >
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
                              <button className={styles.deleteShift} onClick={() => handleDelete(shift)}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                              </button>
                          </div>
                      </Draggable>
                      );
                  })}
                </div>
              </div>
          </div>
        )
        }
        </div>
        {selectedShift?<ShiftForm
                    shift={selectedShift==null ? {start:'', end:''} : selectedShift}
                    error={error}
                    onCancel={() => {
                        setSelectedShift(null);
                        setError(""); // Reset the error when cancelling
                    }}          
                    onSubmit={handleConfirm}
                />:<></> }
        </div>  
    </>
  );
}

