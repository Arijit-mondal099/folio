"use server";

import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db/drizzle";
import { notebooks, notes } from "@/db/schema";
import { auth } from "@/lib/auth";

export type DashboardStats = {
  totalNotebooks: number;
  totalNotes: number;
  notesThisWeek: number;
  mostActiveNotebook: { id: string; name: string; count: number } | null;
  notesPerNotebook: Array<{ id: string; name: string; count: number }>;
  notesPerDay: Array<{ date: string; count: number }>;
  recentNotes: Array<{
    id: string;
    title: string;
    notebookId: string;
    notebookName: string;
    updatedAt: Date;
  }>;
};

const DAYS_WINDOW = 14;

async function getUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
}

export async function getDashboardStats(): Promise<{
  success: boolean;
  message: string;
  data?: DashboardStats;
}> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Please try to re-authenticate" };
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const windowStart = new Date();
    windowStart.setDate(windowStart.getDate() - (DAYS_WINDOW - 1));
    windowStart.setHours(0, 0, 0, 0);

    const [
      totalNotebooksRows,
      totalNotesRows,
      notesThisWeekRows,
      perNotebookRows,
      perDayRows,
      recentRows
    ] = await Promise.all([
      db
        .select({ value: count() })
        .from(notebooks)
        .where(eq(notebooks.userId, userId)),

      db
        .select({ value: count() })
        .from(notes)
        .innerJoin(notebooks, eq(notes.noteBookId, notebooks.id))
        .where(eq(notebooks.userId, userId)),

      db
        .select({ value: count() })
        .from(notes)
        .innerJoin(notebooks, eq(notes.noteBookId, notebooks.id))
        .where(
          and(eq(notebooks.userId, userId), gte(notes.createdAt, oneWeekAgo))
        ),

      db
        .select({
          id: notebooks.id,
          name: notebooks.name,
          count: count(notes.id)
        })
        .from(notebooks)
        .leftJoin(notes, eq(notes.noteBookId, notebooks.id))
        .where(eq(notebooks.userId, userId))
        .groupBy(notebooks.id, notebooks.name)
        .orderBy(desc(count(notes.id))),

      db
        .select({
          day: sql<string>`to_char(${notes.createdAt}, 'YYYY-MM-DD')`,
          value: count()
        })
        .from(notes)
        .innerJoin(notebooks, eq(notes.noteBookId, notebooks.id))
        .where(
          and(eq(notebooks.userId, userId), gte(notes.createdAt, windowStart))
        )
        .groupBy(sql`to_char(${notes.createdAt}, 'YYYY-MM-DD')`),

      db
        .select({
          id: notes.id,
          title: notes.title,
          notebookId: notes.noteBookId,
          notebookName: notebooks.name,
          updatedAt: notes.updatedAt
        })
        .from(notes)
        .innerJoin(notebooks, eq(notes.noteBookId, notebooks.id))
        .where(eq(notebooks.userId, userId))
        .orderBy(desc(notes.updatedAt))
        .limit(5)
    ]);

    const totalNotebooks = totalNotebooksRows[0]?.value ?? 0;
    const totalNotes = totalNotesRows[0]?.value ?? 0;
    const notesThisWeek = notesThisWeekRows[0]?.value ?? 0;

    const notesPerNotebook = perNotebookRows.map((row) => ({
      id: row.id,
      name: row.name,
      count: Number(row.count)
    }));

    const mostActiveNotebook =
      notesPerNotebook[0] && notesPerNotebook[0].count > 0
        ? notesPerNotebook[0]
        : null;

    // Zero-fill day series
    const dayMap = new Map(perDayRows.map((r) => [r.day, Number(r.value)]));
    const notesPerDay: Array<{ date: string; count: number }> = [];
    for (let i = 0; i < DAYS_WINDOW; i++) {
      const d = new Date(windowStart);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      notesPerDay.push({ date: key, count: dayMap.get(key) ?? 0 });
    }

    return {
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totalNotebooks,
        totalNotes,
        notesThisWeek,
        mostActiveNotebook,
        notesPerNotebook,
        notesPerDay,
        recentNotes: recentRows
      }
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard stats"
    };
  }
}
