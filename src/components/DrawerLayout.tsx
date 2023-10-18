//components/DrawerComponent.tsx
import React from "react";
import { useSessionStorage } from "usehooks-ts";
import Navbar from "./Navbar";
import styles from  "../styles/scheduler.module.css";
import { useRouter } from "next/router";


type Props = {
  children: React.ReactNode;
};

const DrawerLayout = ({ children }: Props) => {
  //initialize state here. we use a key and a default state
  const router=useRouter();
  const [open, setOpen] = useSessionStorage("drawer", false);
  return (
    
    <div className="drawer">
      <input
        id="app-drawer"
        type="checkbox"
        className="drawer-toggle"
        // checked property will now reflect our open state
        checked={open}
      />
      <div className="drawer-content">
        <div>
            <Navbar />
            <div className={styles.container}>
                {children}
            </div>
        </div>
        </div>
        <div className="drawer-side">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay" onClick={()=>{setOpen(false)}}></label> 
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <li><a onClick={()=>{router.push('/')}}>Main Page</a></li>
            <li><a onClick={()=>{router.push('/requests')}}>Pending Requests</a></li>
            </ul>
        </div>
    </div>
  );
};

export default DrawerLayout;
