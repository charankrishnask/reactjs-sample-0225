// src/server/api/trpc/routers/tasks.ts
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ✅ Server-side Supabase client using the service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ Gemini AI setup
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const tasksRouter = router({
  // ✅ Get all tasks
  getTasks: publicProcedure.query(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error fetching tasks: ${error.message}`);
    return data;
  }),

  // ✅ Add a new task
  addTask: publicProcedure
    .input(z.object({ title: z.string().min(1, 'Title is required') }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: input.title,
          completed: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting task:', error);
        throw new Error(error.message);
      }

      return data;
    }),

  // ✅ Toggle task completion status
  toggleComplete: publicProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .mutation(async ({ input }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: input.completed })
        .eq('id', input.id);

      if (error) {
        console.error('Error updating task status:', error);
        throw new Error(error.message);
      }

      return { success: true };
    }),

  // ✅ Delete a task
  deleteTask: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', input.id);

      if (error) {
        console.error('Error deleting task:', error);
        throw new Error(error.message);
      }

      return { success: true };
    }),

  // ✅ Update task details
  updateTask: publicProcedure
    .input(
      z.object({
        id: z.number(),
        description: z.string().nullable().optional(),
        date: z.string().nullable().optional(),
        list: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, description, date, list } = input;

      const updatePayload: {
        description?: string | null;
        date?: string | null;
        list?: string | null;
      } = {};
      if (description !== undefined) updatePayload.description = description;
      if (date !== undefined) updatePayload.date = date;
      if (list !== undefined) updatePayload.list = list;

      const { error } = await supabase
        .from('tasks')
        .update(updatePayload)
        .eq('id', id);

      if (error) {
        console.error('Error updating task:', error);
        throw new Error(error.message);
      }

      return { success: true };
    }),

  // ✅ Generate tasks using Gemini AI
  generateFromAI: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const result = await model.generateContent(input.prompt);
        const text = result.response.text();

        const tasks = text
          .split('\n')
          .map((line) => line.replace(/^\d+[\).]?\s*/, '').trim())
          .filter((line) => line.length > 0);

        const inserts = tasks.map((title) => ({
          title,
          completed: false,
        }));

        const { error } = await supabase.from('tasks').insert(inserts);
        if (error) throw new Error(error.message);

        return { added: inserts.length };
      } catch (err: unknown) {
        console.error('Gemini API Error:', err);
        throw new Error('Failed to generate tasks from AI.');
      }
    }),
});
