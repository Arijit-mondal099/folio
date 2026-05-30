"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateNote } from "@/lib/note-queries";
import { EMPTY_DOC } from "@/lib/editor-content";
import { createNoteSchema, type CreateNoteData } from "@/schema/note.schema";

export function NoteDialog({
  open,
  onOpenChange,
  notebookId
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notebookId: string;
}) {
  const createNote = useCreateNote();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateNoteData>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: { title: "" }
  });

  function onSubmit(values: CreateNoteData) {
    createNote.mutate(
      { notebookId, title: values.title, content: EMPTY_DOC },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        }
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>
            Add a new note to this notebook.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="note-title">Title</FieldLabel>
              <Input
                id="note-title"
                placeholder="My note"
                autoFocus
                aria-invalid={!!errors.title}
                {...register("title")}
              />
              {errors.title && <FieldError>{errors.title.message}</FieldError>}
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={createNote.isPending}>
              {createNote.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {createNote.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
