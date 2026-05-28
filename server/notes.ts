"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db/drizzle";
import { notebooks, notes, type NoteSelect } from "@/db/schema";
import { auth } from "@/lib/auth";

async function getUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
}

async function userOwnsNotebook(
  notebookId: string,
  userId: string
): Promise<boolean> {
  const rows = await db
    .select({ id: notebooks.id })
    .from(notebooks)
    .where(and(eq(notebooks.id, notebookId), eq(notebooks.userId, userId)));
  return !!rows[0];
}

export async function createNote(input: {
  notebookId: string;
  title: string;
  content: unknown;
}): Promise<{ success: boolean; message: string }> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Please try to re-authenticate" };
    }

    if (!(await userOwnsNotebook(input.notebookId, userId))) {
      return { success: false, message: "Unauthorized" };
    }

    await db.insert(notes).values({
      id: crypto.randomUUID(),
      title: input.title,
      content: input.content,
      noteBookId: input.notebookId
    });

    return { success: true, message: "Note created successfully" };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Note creation failed, please try again!"
    };
  }
}

export async function getNotes(notebookId: string): Promise<{
  success: boolean;
  message: string;
  data?: NoteSelect[];
}> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Please try to re-authenticate" };
    }

    if (!(await userOwnsNotebook(notebookId, userId))) {
      return { success: false, message: "Unauthorized" };
    }

    const notebookNotes = await db
      .select()
      .from(notes)
      .where(eq(notes.noteBookId, notebookId));

    return {
      success: true,
      message: "Notes fetched successfully",
      data: notebookNotes
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get notes, please try again!"
    };
  }
}

export async function getNoteById(
  notebookId: string,
  noteId: string
): Promise<{
  success: boolean;
  message: string;
  data?: NoteSelect;
}> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Please try to re-authenticate" };
    }

    if (!(await userOwnsNotebook(notebookId, userId))) {
      return { success: false, message: "Unauthorized" };
    }

    const rows = await db
      .select()
      .from(notes)
      .where(and(eq(notes.noteBookId, notebookId), eq(notes.id, noteId)));

    if (!rows[0]) {
      return { success: false, message: "Note not found" };
    }

    return {
      success: true,
      message: "Note fetched successfully",
      data: rows[0]
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get note, please try again!"
    };
  }
}

export async function updateNote(
  notebookId: string,
  noteId: string,
  values: { title?: string; content?: unknown }
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Please try to re-authenticate" };
    }

    if (!(await userOwnsNotebook(notebookId, userId))) {
      return { success: false, message: "Unauthorized" };
    }

    const patch: { title?: string; content?: unknown } = {};
    if (typeof values.title === "string") patch.title = values.title;
    if (values.content !== undefined) patch.content = values.content;

    if (Object.keys(patch).length === 0) {
      return { success: false, message: "No changes provided" };
    }

    const result = await db
      .update(notes)
      .set(patch)
      .where(and(eq(notes.id, noteId), eq(notes.noteBookId, notebookId)))
      .returning({ id: notes.id });

    if (!result[0]) {
      return { success: false, message: "Note not found" };
    }

    return { success: true, message: "Note updated successfully" };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update note, please try again!"
    };
  }
}

export async function deleteNote(
  notebookId: string,
  noteId: string
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Please try to re-authenticate" };
    }

    if (!(await userOwnsNotebook(notebookId, userId))) {
      return { success: false, message: "Unauthorized" };
    }

    const result = await db
      .delete(notes)
      .where(and(eq(notes.id, noteId), eq(notes.noteBookId, notebookId)))
      .returning({ id: notes.id });

    if (!result[0]) {
      return { success: false, message: "Note not found" };
    }

    return { success: true, message: "Note deleted successfully" };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Note deletion failed, please try again!"
    };
  }
}
