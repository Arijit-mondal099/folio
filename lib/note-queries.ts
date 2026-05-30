"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote
} from "@/server/notes";
import { dashboardKeys } from "@/lib/dashboard-queries";

export const noteKeys = {
  all: ["notes"] as const,
  lists: () => [...noteKeys.all, "list"] as const,
  list: (notebookId: string) => [...noteKeys.lists(), notebookId] as const,
  detail: (notebookId: string, noteId: string) =>
    [...noteKeys.all, "detail", notebookId, noteId] as const
};

export function useNotes(notebookId: string) {
  return useQuery({
    queryKey: noteKeys.list(notebookId),
    queryFn: async () => {
      const result = await getNotes(notebookId);
      if (!result.success) throw new Error(result.message);
      return result.data ?? [];
    },
    enabled: !!notebookId
  });
}

export function useNote(notebookId: string, noteId: string) {
  return useQuery({
    queryKey: noteKeys.detail(notebookId, noteId),
    queryFn: async () => {
      const result = await getNoteById(notebookId, noteId);
      if (!result.success) throw new Error(result.message);
      return result.data ?? null;
    },
    enabled: !!notebookId && !!noteId
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      notebookId: string;
      title: string;
      content: unknown;
    }) => {
      const result = await createNote(input);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (result, { notebookId }) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: noteKeys.list(notebookId) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      notebookId,
      noteId,
      values
    }: {
      notebookId: string;
      noteId: string;
      values: { title?: string; content?: unknown };
    }) => {
      const result = await updateNote(notebookId, noteId, values);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (_result, { notebookId, noteId }) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.list(notebookId) });
      queryClient.invalidateQueries({
        queryKey: noteKeys.detail(notebookId, noteId)
      });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      notebookId,
      noteId
    }: {
      notebookId: string;
      noteId: string;
    }) => {
      const result = await deleteNote(notebookId, noteId);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (result, { notebookId }) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: noteKeys.list(notebookId) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}
