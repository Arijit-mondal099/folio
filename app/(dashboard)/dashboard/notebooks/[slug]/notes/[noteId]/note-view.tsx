"use client";

import { FileText } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { NoteEditor } from "@/components/editor/note-editor";
import { useNote } from "@/lib/note-queries";

export function NoteView({
  notebookId,
  noteId
}: {
  notebookId: string;
  noteId: string;
}) {
  const note = useNote(notebookId, noteId);

  if (note.isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (note.isError || !note.data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <FileText className="size-5 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          {note.error?.message ?? "Note not found."}
        </p>
      </div>
    );
  }

  return <NoteEditor note={note.data} notebookId={notebookId} />;
}
