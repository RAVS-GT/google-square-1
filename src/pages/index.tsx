import Head from "next/head";
import Link from "next/link";
import DaySchedule from "../components/DaySchedule"

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const shifts = [
    { start: "09:15", end: "11:45", color: "#007bff" },
    { start: "13:00", end: "16:00", color: "#e44d25" },
    { start: "20:00", end: "22:45", color: "#e44d25" }
  ];
  return (
    <>

      <main>
        <DaySchedule initialShifts={shifts}></DaySchedule>
      </main>
    </>
  );
}
