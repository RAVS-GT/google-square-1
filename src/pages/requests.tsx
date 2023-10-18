import { useEffect, type ReactElement, useState } from 'react'
import type { NextPageWithLayout } from './_app'
import DaySchedule from "../components/DaySchedule"
import requestTable from "../components/requestTable"
import Form from "../components/Form"
import styles from  "../styles/scheduler.module.css";
import { api } from "~/utils/api";
import Layout from '../components/Layout'
import DrawerLayout from '~/components/DrawerLayout';
import { getColor } from '~/components/functions';
import ContainerCard from '~/components/ContainerCard';
import { auth, clerkClient, useClerk, useUser } from '@clerk/nextjs';
import { Chat } from '~/components/ChatComponents';
import { Employee } from '~/classes/employee'
import { get } from 'http'

function Home() {

  const getAllIds=api.schedule.getIds.useQuery()

  const [employee,setEmployee]=useState<Employee[]>([])

  if(getAllIds.isSuccess){
    console.log(getAllIds.data)
  }

  // const { userId } : { userId: string | null } = getAuth();
  // const user = clerkClient.users.getUser(userId!);

const {user} = useUser();

  const getEmployee=api.schedule.checkEmail.useQuery({ user: user })

  const getScheduler=()=>{
    console.log(getEmployee.data.isManager)
    if(!getEmployee.data.isManager){
      return(
        <Chat employeeId={getEmployee.data.id}/>
      )
    }
    return (getAllIds.isLoading? 
      (<span className="loading loading-dots loading-lg"></span>)
      :
      (getAllIds.isError? 
        (<span className="text-red-500">Error</span>)   
        : 
        getAllIds.data.map((data) => (
        <div key={data.id} className="my-4">
          <DaySchedule initialShifts={shifts} employee={new Employee(data)}></DaySchedule>
        </div>
      )))
      )
  }

  return (
    <>

      <main>
        {requestTable()}
        {/* <Chat/> */}
        {/* <ContainerCard isMin={true}>
          <Form/>
        </ContainerCard> */}
        {/* {getAllIds.isLoading? 
        getAllIds.isError? 
          (<span className="text-red-500">Error</span>) 
          :
        (<span className="loading loading-dots loading-lg"></span>) 
          : 
          getAllIds.data.map((data) => (  
          <div key={data.id} className="my-4">
            <DaySchedule initialShifts={shifts} employee={new Employee(data)}></DaySchedule>
          </div>
        ))} */}
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
