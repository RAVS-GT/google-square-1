import type { ReactElement } from 'react'
import type { NextPageWithLayout } from './_app'
import DaySchedule from "../components/DaySchedule"
import styles from  "../styles/scheduler.module.css";


import { api } from "~/utils/api";

import Layout from '../components/Layout'
import DrawerLayout from '~/components/DrawerLayout';


function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  let lastColor = null;
  const getColor=()=>{

      const colors=["#ff1d58","#f75990","#fff685","#00DDFF","#0049B7"];
      //randomly get a color from the list. make sure no two adjacent shifts have the same color
      let color = colors[Math.floor(Math.random() * colors.length)];
      while(color === lastColor){
          color = colors[Math.floor(Math.random() * colors.length)];
      }
      lastColor = color;
      return color;
  }

  const shifts = [
    { start: "09:00", end: "10:00"},
    { start: "13:00", end: "16:00"},
    { start: "20:00", end: "22:45"},
  ].map((shift)=>{
    return {...shift, color: getColor()}
  })

  return (
    <>

      <main>
        <DaySchedule initialShifts={shifts}></DaySchedule>
      </main>
      <button className="btn btn-primary" onClick={() => hello.refetch()}>
        hello
      </button>
    </>
  );
}


Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <DrawerLayout>
      {page}
    </DrawerLayout>
  )
}
 
export default Home
