import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
const BASE_URL = 'https://bubblypolishedfiletype.randomcoder1234.repl.co';
const LLM_BASE_URL= `https://growlinganimatedmicroinstruction.randomcoder1234.repl.co`

export const schedulerRouter = createTRPCRouter({

  createTable: publicProcedure
    .input(z.object({}))
    .query(async () => {
      const response = await fetch(`${BASE_URL}/create_table`, {
        method: 'POST'
      });
      const data = await response.json();
      console.log(data);
      return data
    }),

  insertShift: publicProcedure
    .input(z.object({ shiftData: z.any() }))
    .query(async ({ input }) => {
      const { shiftData } = input;
      const response = await fetch(`${BASE_URL}/insert_shift`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shiftData)
      });
      const data = await response;
      console.log(data);
      return data
    }),

  getShift: publicProcedure
    .input(z.object({ shiftId: z.string() }))
    .query(async ({ input }) => {
      const { shiftId } = input;
      const response = await fetch(`${BASE_URL}/get_shift/${shiftId}`);
      const data = await response.json();
      console.log(data);
      return data
    }),

  updateShift: publicProcedure
    .input(z.object({ shiftId: z.string(), updatedShiftData: z.any() }))
    .query(async ({ input }) => {
      const { shiftId, updatedShiftData } = input;
      const response = await fetch(`${BASE_URL}/update_shift/${shiftId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedShiftData)
      });
      const data = await response.json();
      console.log(data);
      return data
    }),

  getAllShifts: publicProcedure
    .query(async () => {
      const response = await fetch(`${BASE_URL}/get_all_shifts`);
      const data = await response.json();
      console.log("All Shifts:", data);
      return data
    }),

  searchShifts: publicProcedure
    .input(z.object({ criteria: z.any() }))
    .query(async ({ input }) => {
      const { criteria } = input;
      const queryParams = new URLSearchParams(criteria);
      const response = await fetch(`${BASE_URL}/search_shifts?${queryParams.toString()}`);
      const data = await response.json();
      console.log(data);
      return data
    }),

  getShiftsByTimeRange: publicProcedure
    .input(z.object({ start_time: z.string(), end_time: z.string() }))
    .query(async ({ input }) => {
      const { start_time, end_time } = input;
      const response = await fetch(`${BASE_URL}/get_shifts_by_time_range?start_time=${start_time}&end_time=${end_time}`);
      const data = await response.json();
      console.log(data);
      return data
    }),

  deleteAllShifts: publicProcedure
    .input(z.object({}))
    .query(async () => {
      const response = await fetch(`${BASE_URL}/delete_all_shifts`, {
        method: 'DELETE'
      });
      const data = await response.json();
      console.log(data);
      return data
    }),

  deleteShift: publicProcedure
    .input(z.object({ shiftId: z.string() }))
    .query(async ({ input }) => {
      const { shiftId } = input;
      const response = await fetch(`${BASE_URL}/delete_shift/${shiftId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      console.log(data);
      return data
    }),


  getFreeEmployeesForShift: publicProcedure
    .input(z.object({ shiftId: z.string() }))
    .query(async ({ input }) => {
      const { shiftId } = input;
      const response = await fetch(`${BASE_URL}/get_free_employees_for_shift/${shiftId}`);
      const data = await response.json();
      console.log(data);
      return data
    }),

  updateShiftsForDayAndEmployee: publicProcedure
    .input(z.object({
      day: z.string(),
      employeeId: z.string(),
      shifts: z.array(z.object({ id: z.string(), start_at: z.string(), end_at: z.string() }))
    }))
    .mutation(async ({ input }) => {
      console.log("input", input)
      const { day, employeeId, shifts } = input;
      const response = await fetch(`${BASE_URL}/update_shifts_for_day_and_employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ day, employee_id: employeeId, shifts })
      });
      const data = await response.json();
      console.log(data);
      return data
    }),

  getShiftsByDayAndEmployee: publicProcedure
    .input(z.object({
      day: z.string(),
      employeeId: z.string()
    }))
    .query(async ({ input }) => {
      const { day, employeeId } = input;
      const response = await fetch(`${BASE_URL}/get_shifts_by_day_and_employee?day=${day}&employee_id=${employeeId}`);
      const data = await response.json();
      console.log(data);
      return data
    }),

  checkEmail: publicProcedure
    .input(z.object({ user: z.any() }))
    .query(async ({ input }) => {
      const { user } = input;
      const userData = await user
      const emailAddress = userData.emailAddresses[0].emailAddress
      console.log('email', emailAddress)
      const response = await fetch(`${BASE_URL}/check_email/${emailAddress}`);
      const data = (await response.json()).emailExists;
      console.log('check',data);
      console.log('check',data);
      data.isManager = false
      if(emailAddress=== 'arnavch04@gmail.com'){
        data.isManager = true
        return data
      }
      return data
    }),

    getIds: publicProcedure
    .query(async () =>{
      const response = await fetch(`${BASE_URL}/get_all_ids`)
      const data = await response.json();
      // console.log(data)
      // console.log(data.information)
      // console.log(data.information.team_members)
      return data.information.team_members
    }),

    sendMessageLlm: publicProcedure
    .input(z.object({message: z.string(), sessionId: z.string()}))
    .mutation(async ({input}) =>{
      const {message, sessionId} = input;
      const response = await fetch(`${LLM_BASE_URL}/run_knowledge_llm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'empt_input': message,
          'session_id': sessionId
      })
      })
      const data = await response.json();
      console.log(data)
      return data
    }),

    sendUnAnsMessageLlm: publicProcedure
    .input(z.object({message: z.string(), employeeId: z.string(), sessionId: z.string()}))
    .mutation(async ({input}) =>{
      const {message, employeeId, sessionId} = input;
      const response = await fetch(`${LLM_BASE_URL}/query_palm_api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'user_input': message,
          'emp_id': employeeId,
          'session_id': sessionId
      })
      })
      const data = await response.json();
      return data
    }),
})