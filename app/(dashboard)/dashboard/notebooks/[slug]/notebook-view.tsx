"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, Plus, SearchIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteDialog } from "@/components/form/note-dialog";
import { SortButton, type SortMode } from "@/components/sort-button";
import { useNotebook } from "@/lib/notebook-queries";
import { useDeleteNote, useNotes } from "@/lib/note-queries";
import { useConfirm } from "@/components/providers/confirm-provider";
import type { NoteSelect } from "@/db/schema";

function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

function sortNotes(notes: NoteSelect[], mode: SortMode): NoteSelect[] {
  const sorted = [...notes];
  switch (mode) {
    case "name-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "date-new":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "date-old":
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }
}

export function NotebookView({ notebookId }: { notebookId: string }) {
  const notebook = useNotebook(notebookId);
  const notes = useNotes(notebookId);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortMode, setSortMode] = React.useState<SortMode>("date-new");

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;
  const filteredNotes = React.useMemo(() => {
    if (!notes.data) return [];
    const filtered = isSearching
      ? notes.data.filter((n) => n.title.toLowerCase().includes(trimmedQuery))
      : notes.data;
    return sortNotes(filtered, sortMode);
  }, [notes.data, isSearching, trimmedQuery, sortMode]);

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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {notebook.data.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isSearching
            ? `${filteredNotes.length} of ${notes.data?.length ?? 0} notes`
            : `${notes.data?.length ?? 0} ${(notes.data?.length ?? 0) === 1 ? "note" : "notes"}`}
        </p>
      </div>

      {notes.data && notes.data.length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-md">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
            <Input
              type="search"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <SortButton
              value={sortMode}
              onChange={setSortMode}
              ariaLabel="Sort notes"
            />
            <Button onClick={openCreate} className="flex-1 sm:flex-initial">
              <Plus className="size-4" />
              New Note
            </Button>
          </div>
        </div>
      )}

      {notes.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} notebookId={notebookId} />
          ))}
        </div>
      ) : isSearching ? (
        <NoMatchState query={searchQuery} />
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
    <Card className="transition-colors hover:bg-muted/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 truncate text-base">
          <FileText className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{note.title}</span>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex items-center justify-between gap-2">
        <span className="truncate text-xs text-muted-foreground">
          Updated {formatRelativeTime(note.updatedAt)}
        </span>
        <div className="flex shrink-0 items-center gap-2">
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
        </div>
      </CardFooter>
    </Card>
  );
}

function NoMatchState({ query }: { query: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <SearchIcon className="size-5 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium">No notes match</p>
        <p className="text-sm text-muted-foreground">
          Nothing found for &ldquo;{query}&rdquo;.
        </p>
      </div>
    </div>
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
