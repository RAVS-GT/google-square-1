import { on } from "events";
import React from "react";
import { calculateX, getHours } from "./functions";



export default function ShiftForm({ shift, error, onCancel, onSubmit }) {
    if(shift.start === '') return (<div></div>)
    
    const [start, seStart] = React.useState(shift.start);
    const [end, seEnd] = React.useState(shift.end);

    const setStart = (start) => {
        if(getHours(start) < 10) {
            start = '0'+start;
        }
        seStart(start);
    }

    const setEnd = (end) => {
        if(getHours(end) < 10) {
            end = '0'+end;
        }
        seEnd(end);
    }

    React.useEffect(() => {
        setStart(shift.start);
        setEnd(shift.end);
    }
    , [shift]);
    
    return (
        <div className="shift-form">
            <h2>Edit Shift</h2>  
          
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Start Time</span>
            </label>
            <input
                type="time"
                name="start"
                onChange={ev => {
                    setStart(ev.target.value)
                }}
                min="00:00"
                max="23:55"
                step="300"
                value={start}
            />

            <label className="label">
              <span className="label-text">End Time</span>
            </label>

            <input
                type="time"
                name="end"
                onChange={ev => {
                    setEnd(ev.target.value)
                }}
                min="00:00"
                max="23:55"
                step="300"
                value={end}
            />
            
          </div>

          {/* Display error message */}
          {error && <p style={{ color: 'red' }}>{error}</p>}
    
          <button className="btn btn-primary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>{onSubmit({
            start:start,
            end:end,
            color:shift.color,
            x:calculateX(start),
        })}}>Confirm</button>
        </div>
      );
    }