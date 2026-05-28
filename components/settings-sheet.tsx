"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { useConfirm } from "@/components/providers/confirm-provider";

export function SettingsSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const confirm = useConfirm();

  async function handleDeleteAccount() {
    const ok = await confirm({
      title: "Delete account?",
      description:
        "Your account and all associated data will be permanently deleted. This cannot be undone.",
      confirmText: "Delete Account",
      destructive: true
    });
    if (!ok) return;
    const { error } = await authClient.deleteUser();
    if (error) {
      toast.error(error.message ?? "Failed to delete account");
    } else {
      toast.success("Account deleted");
      setOpen(false);
      router.replace("/");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-4">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => {
              setOpen(false);
              router.push("/dashboard/change-password");
            }}
          >
            <KeyRound className="size-4" />
            Change Password
          </Button>

          <Separator />

          <div>
            <h3 className="flex items-center gap-2 text-sm font-medium mb-2">
              <Trash2 className="size-4 text-destructive" />
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
