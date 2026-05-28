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
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateNotebook } from "@/lib/notebook-queries";
import {
  createNotebookSchema,
  type CreateNotebookData
} from "@/schema/notebook.schema";

export function CreateNoteBook({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const createNotebook = useCreateNotebook();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateNotebookData>({
    resolver: zodResolver(createNotebookSchema),
    defaultValues: { name: "" }
  });

  function onSubmit(values: CreateNotebookData) {
    createNotebook.mutate(values.name, {
      onSuccess: () => {
        reset();
        setOpen(false);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Notebook</DialogTitle>
          <DialogDescription>
            Give your notebook a name to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="notebook-name">Name</FieldLabel>
              <Input
                id="notebook-name"
                placeholder="My Notebook"
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
            <Button type="submit" disabled={createNotebook.isPending}>
              {createNotebook.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {createNotebook.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
