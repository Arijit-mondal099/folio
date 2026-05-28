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
import { useUpdateNotebook } from "@/lib/notebook-queries";
import {
  renameNotebookSchema,
  type RenameNotebookData
} from "@/schema/notebook.schema";

export function RenameNotebookDialog({
  open,
  onOpenChange,
  notebookId,
  currentName
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notebookId: string;
  currentName: string;
}) {
  const updateNotebook = useUpdateNotebook();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<RenameNotebookData>({
    resolver: zodResolver(renameNotebookSchema),
    defaultValues: { name: currentName }
  });

  React.useEffect(() => {
    if (open) reset({ name: currentName });
  }, [open, currentName, reset]);

  function onSubmit(values: RenameNotebookData) {
    if (values.name === currentName) {
      onOpenChange(false);
      return;
    }
    updateNotebook.mutate(
      { id: notebookId, values: { name: values.name } },
      { onSuccess: () => onOpenChange(false) }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Rename Notebook</DialogTitle>
          <DialogDescription>
            Choose a new name for this notebook.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="rename-notebook-name">Name</FieldLabel>
              <Input
                id="rename-notebook-name"
                autoFocus
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={updateNotebook.isPending}>
              {updateNotebook.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {updateNotebook.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
