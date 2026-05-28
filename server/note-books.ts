"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db/drizzle";
import { notebooks, type NoteBookSelect, NoteBookIntert } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function createNoteBook(
  name: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;

    if (!userId) {
      return { success: false, message: "Please try to re-authenticate" };
    }

    await db.insert(notebooks).values({
      name,
      userId
    });

    return { success: true, message: "Notebook created successfully" };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Notebook creation failed, please try again!"
    };
  }
}

export async function getNoteBooks(): Promise<{
  success: boolean;
  message: string;
  data?: NoteBookSelect[];
}> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;

    if (!userId) {
      return { success: false, message: "Please try to re-authenticate" };
    }

    const noteBooks = await db
      .select()
      .from(notebooks)
      .where(eq(notebooks.userId, userId));

    return { success: true, message: "note books fetched", data: noteBooks };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Note book creation failed, please try again!",
      data: []
    };
  }
}

export async function getNoteBookById(id: string): Promise<{
  success: boolean;
  message: string;
  data?: NoteBookSelect | null;
}> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;

    if (!userId) {
      return { success: false, message: "Please try to re-authenticate" };
    }

    const noteBook = await db
      .select()
      .from(notebooks)
      .where(and(eq(notebooks.id, id), eq(notebooks.userId, userId)));

    return {
      success: true,
      message: "note book fetched",
      data: noteBook[0] ?? null
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Note book creation failed, please try again!",
      data: null
    };
  }
}

export async function updateNotebook(
  id: string,
  values: Partial<NoteBookIntert>
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;

    if (!userId) {
      return { success: false, message: "Please try to re-authenticate" };
    }

    await db
      .update(notebooks)
      .set(values)
      .where(and(eq(notebooks.id, id), eq(notebooks.userId, userId)));

    return { success: true, message: "Noteb book updated successfully" };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Note book updation failed, please try again!"
    };
  }
}

export async function deleteNoteBook(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;

    if (!userId) {
      return { success: false, message: "Please try to re-authenticate" };
    }

    await db
      .delete(notebooks)
      .where(and(eq(notebooks.id, id), eq(notebooks.userId, userId)));

    return { success: true, message: "Noteb book deleted successfully" };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Note book deletion failed, please try again!"
    };
  }
}
