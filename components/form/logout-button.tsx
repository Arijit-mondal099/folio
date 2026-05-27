"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Logout() {
  const router = useRouter();

  async function handleLogout(): Promise<void> {
    try {
      await authClient.signOut();
      toast.success("Logout successfully");
      router.replace("/");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Faild to logout please try again"
      );
    }
  }

  return (
    <Button variant={"destructive"} onClick={handleLogout}>
      <LogOut />
      Logout
    </Button>
  );
}
