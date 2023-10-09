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
        <div className="mt-6">
            <h2>Edit Shift</h2>  
          
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Start Time</span>
            </label>

            <div className="rounded-md border-2 border-slate-200 px-3">
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
            </div>

            <label className="label">
              <span className="label-text">End Time</span>
            </label>

            <div className="rounded-md border-2 border-slate-200 px-3">
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
            
          </div>

          {/* Display error message */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="flex flex-row space-x-2 mt-4">
    
            <button className="btn btn-sm" onClick={onCancel}>Cancel</button>
            <button className="btn btn-sm" onClick={()=>{onSubmit({
                start:start,
                end:end,
                color:shift.color,
                x:calculateX(start),
            })}}>Confirm</button>
            
        </div>
        </div>
      );
    }