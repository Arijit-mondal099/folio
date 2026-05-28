import { z } from "zod";

export const createNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Title is required" })
    .max(200, { error: "Title must be at most 200 characters" })
});

export type CreateNoteData = z.infer<typeof createNoteSchema>;
