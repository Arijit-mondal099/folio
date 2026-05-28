"use client";

import * as React from "react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useDeleteNotebook, useNotebooks } from "@/lib/notebook-queries";
import { RenameNotebookDialog } from "@/components/form/rename-notebook";
import { useConfirm } from "@/components/providers/confirm-provider";
import type { SortMode } from "@/components/sort-button";
import type { NoteBookSelect } from "@/db/schema";
import Link from "next/link";

function sortNotebooks(
  notebooks: NoteBookSelect[],
  mode: SortMode
): NoteBookSelect[] {
  const sorted = [...notebooks];
  switch (mode) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
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

export function AppSidebarContent({ sortMode }: { sortMode: SortMode }) {
  const { data: notebooks, isLoading } = useNotebooks();
  const [renameTarget, setRenameTarget] = React.useState<NoteBookSelect | null>(
    null
  );
  const sorted = React.useMemo(
    () => (notebooks ? sortNotebooks(notebooks, sortMode) : []),
    [notebooks, sortMode]
  );

  return (
    <SidebarContent className="gap-0">
      <SidebarGroup>
        <SidebarGroupLabel>Notebooks</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {isLoading ? (
              <>
                <SidebarMenuItem>
                  <Skeleton className="h-7 w-full mb-1" />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Skeleton className="h-7 w-full" />
                </SidebarMenuItem>
              </>
            ) : sorted.length > 0 ? (
              sorted.map((notebook) => (
                <NotebookMenuItem
                  key={notebook.id}
                  notebook={notebook}
                  onRename={() => setRenameTarget(notebook)}
                />
              ))
            ) : (
              <SidebarMenuItem>
                <span className="px-2 py-1 text-xs text-muted-foreground">
                  No notebooks yet
                </span>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {renameTarget && (
        <RenameNotebookDialog
          open={!!renameTarget}
          onOpenChange={(open) => !open && setRenameTarget(null)}
          notebookId={renameTarget.id}
          currentName={renameTarget.name}
        />
      )}
    </SidebarContent>
  );
}

function NotebookMenuItem({
  notebook,
  onRename
}: {
  notebook: NoteBookSelect;
  onRename: () => void;
}) {
  const deleteNotebook = useDeleteNotebook();
  const confirm = useConfirm();

  async function handleDelete() {
    const ok = await confirm({
      title: "Delete notebook?",
      description: `"${notebook.name}" and all its notes will be permanently deleted. This cannot be undone.`,
      confirmText: "Delete",
      destructive: true
    });
    if (!ok) return;
    deleteNotebook.mutate(notebook.id);
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={`/dashboard/notebooks/${notebook.id}`}>
          <BookOpen className="size-4" />
          {notebook.name}
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal className="size-4" />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-44">
          <DropdownMenuItem onClick={onRename}>
            <Pencil className="size-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
