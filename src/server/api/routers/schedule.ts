import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
const BASE_URL = 'http://randomuser0808.pythonanywhere.com';

export const schedulerRouter = createTRPCRouter({
  
  createTable: publicProcedure
    .input(z.object({}))
    .query(async () => {
      const response = await fetch(`${BASE_URL}/create_table`, {
        method: 'POST'
      });
      const data = await response.json();
      console.log(data);
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
      const data = await response.json();
      console.log(data);
    }),

  getShift: publicProcedure
    .input(z.object({ shiftId: z.string() }))
    .query(async ({ input }) => {
      const { shiftId } = input;
      const response = await fetch(`${BASE_URL}/get_shift/${shiftId}`);
      const data = await response.json();
      console.log(data);
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
    }),

  getAllShifts: publicProcedure
    .input(z.object({}))
    .query(async () => {
      const response = await fetch(`${BASE_URL}/get_all_shifts`);
      const data = await response.json();
      console.log("All Shifts:", data);
    }),

  searchShifts: publicProcedure
    .input(z.object({ criteria: z.any() }))
    .query(async ({ input }) => {
      const { criteria } = input;
      const queryParams = new URLSearchParams(criteria);
      const response = await fetch(`${BASE_URL}/search_shifts?${queryParams.toString()}`);
      const data = await response.json();
      console.log(data);
    }),

  getShiftsByTimeRange: publicProcedure
    .input(z.object({ start_time: z.string(), end_time: z.string() }))
    .query(async ({ input }) => {
      const { start_time, end_time } = input;
      const response = await fetch(`${BASE_URL}/get_shifts_by_time_range?start_time=${start_time}&end_time=${end_time}`);
      const data = await response.json();
      console.log(data);
    }),

  deleteAllShifts: publicProcedure
    .input(z.object({}))
    .query(async () => {
      const response = await fetch(`${BASE_URL}/delete_all_shifts`, {
        method: 'DELETE'
      });
      const data = await response.json();
      console.log(data);
    })

})
