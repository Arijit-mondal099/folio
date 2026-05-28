import { z } from "zod";

const nameField = z
  .string()
  .trim()
  .min(1, { error: "Name is required" })
  .max(100, { error: "Name must be at most 100 characters" });

export const createNotebookSchema = z.object({
  name: nameField
});

export const renameNotebookSchema = z.object({
  name: nameField
});

export type CreateNotebookData = z.infer<typeof createNotebookSchema>;
export type RenameNotebookData = z.infer<typeof renameNotebookSchema>;
