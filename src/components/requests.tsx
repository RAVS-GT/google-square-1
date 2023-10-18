import { useState } from "react"


const requestPage=()=>{
    const [requests,setRequests]=useState<Request[]>([])
    const [activeTab,setActiveTab]=useState<string>("pending")


    return(
        <div>
            <div className="tabs">
                <a className={`tab tab-lifted ${activeTab=='pending'? "tab-active": ""}`}>Pending</a> 
                <a className={`tab tab-lifted ${activeTab=='accepted'? "tab-active": ""}`}>Accepted</a> 
                <a className={`tab tab-lifted ${activeTab=='denied'? "tab-active": ""}`}>Denied</a> 
            </div>
        </div>
    )
}
