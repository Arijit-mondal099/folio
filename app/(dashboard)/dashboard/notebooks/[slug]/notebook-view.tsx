"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteDialog } from "@/components/form/note-dialog";
import { useNotebook } from "@/lib/notebook-queries";
import { useDeleteNote, useNotes } from "@/lib/note-queries";
import { useConfirm } from "@/components/providers/confirm-provider";
import type { NoteSelect } from "@/db/schema";

export function NotebookView({ notebookId }: { notebookId: string }) {
  const notebook = useNotebook(notebookId);
  const notes = useNotes(notebookId);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function openCreate() {
    setDialogOpen(true);
  }

  if (notebook.isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!notebook.data) {
    return (
      <div className="flex min-h-[40svh] items-center justify-center text-muted-foreground">
        Notebook not found.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {notebook.data.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {notes.data?.length ?? 0}{" "}
            {(notes.data?.length ?? 0) === 1 ? "note" : "notes"}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          New Note
        </Button>
      </div>

      {notes.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : notes.data && notes.data.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.data.map((note) => (
            <NoteCard key={note.id} note={note} notebookId={notebookId} />
          ))}
        </div>
      ) : (
        <EmptyState onCreate={openCreate} />
      )}

      <NoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        notebookId={notebookId}
      />
    </div>
  );
}

function NoteCard({
  note,
  notebookId
}: {
  note: NoteSelect;
  notebookId: string;
}) {
  const deleteNote = useDeleteNote();
  const confirm = useConfirm();

  async function handleDelete() {
    const ok = await confirm({
      title: "Delete note?",
      description: `"${note.title}" will be permanently deleted. This cannot be undone.`,
      confirmText: "Delete",
      destructive: true
    });
    if (!ok) return;
    deleteNote.mutate({ notebookId, noteId: note.id });
  }

  return (
    <Card className="flex flex-col justify-between gap-4 transition-colors hover:bg-muted/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 truncate text-base">
          <FileText className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{note.title}</span>
        </CardTitle>
      </CardHeader>
      <CardFooter className="justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard/notebooks/${notebookId}/notes/${note.id}`}>
            View
          </Link>
        </Button>
        <Button
          variant="destructive"
          size="icon-sm"
          onClick={handleDelete}
          disabled={deleteNote.isPending}
          aria-label={`Delete ${note.title}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <FileText className="size-5 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium">No notes yet</p>
        <p className="text-sm text-muted-foreground">
          Create your first note to get started.
        </p>
      </div>
      <Button onClick={onCreate} size="sm">
        <Plus className="size-4" />
        New Note
      </Button>
    </div>
  );
}
