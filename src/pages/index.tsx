import type { ReactElement } from 'react'
import type { NextPageWithLayout } from './_app'
import DaySchedule from "../components/DaySchedule"
import Form from "../components/Form"
import styles from  "../styles/scheduler.module.css";
import { api } from "~/utils/api";
import Layout from '../components/Layout'
import DrawerLayout from '~/components/DrawerLayout';
import { employees } from '~/classes/employee';
import { getColor } from '~/components/functions';
import ContainerCard from '~/components/ContainerCard';
import { useClerk } from '@clerk/nextjs';

function Home() {

  const shifts = [
    { start: "9:00", end: "10:00"},
    { start: "13:00", end: "16:00"},
    { start: "20:00", end: "22:45"},
  ].map((shift)=>{
    return {...shift, color: getColor()}
  })

  const getAllShifts=api.schedule.getAllShifts
  getAllShifts.useQuery()

  useClerk()
  
  return (
    <>

      <main>
      <div className="chat chat-start">
        <div className="chat-bubble">It's over Anakin, <br/>I have the high ground.</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble">You underestimate my power!</div>
      </div>
        {/* <ContainerCard isMin={true}>
          <Form/>
        </ContainerCard> */}
        {/* {employees.map((employee) => (  
          <div key={employee.employeeId} className="my-4">
            <DaySchedule initialShifts={shifts} employee={employee}></DaySchedule>
          </div>
        ))} */}
        <div className="h-48"></div>
      </main>
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
