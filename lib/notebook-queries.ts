"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createNoteBook,
  deleteNoteBook,
  getNoteBookById,
  getNoteBooks,
  updateNotebook
} from "@/server/note-books";
import type { NoteBookIntert } from "@/db/schema";
import { dashboardKeys } from "@/lib/dashboard-queries";

export const notebookKeys = {
  all: ["notebooks"] as const,
  lists: () => [...notebookKeys.all, "list"] as const,
  detail: (id: string) => [...notebookKeys.all, "detail", id] as const
};

export function useNotebooks() {
  return useQuery({
    queryKey: notebookKeys.lists(),
    queryFn: async () => {
      const result = await getNoteBooks();
      if (!result.success) throw new Error(result.message);
      return result.data ?? [];
    }
  });
}

export function useNotebook(id: string) {
  return useQuery({
    queryKey: notebookKeys.detail(id),
    queryFn: async () => {
      const result = await getNoteBookById(id);
      if (!result.success) throw new Error(result.message);
      return result.data ?? null;
    },
    enabled: !!id
  });
}

export function useCreateNotebook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const result = await createNoteBook(name);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: notebookKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

export function useUpdateNotebook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values
    }: {
      id: string;
      values: Partial<NoteBookIntert>;
    }) => {
      const result = await updateNotebook(id, values);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (result, { id }) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: notebookKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notebookKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

export function useDeleteNotebook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteNoteBook(id);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: notebookKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}
