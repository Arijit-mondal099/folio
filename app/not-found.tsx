"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  const { data: session } = authClient.useSession();
  const href = session ? "/dashboard" : "/login";
  const label = session ? "Back to Dashboard" : "Back to Login";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="size-10 text-muted-foreground" />
        </div>
        <h1 className="text-7xl font-bold tracking-tight">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved, deleted, or never existed.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild variant="outline" onClick={() => history.back()}>
            <span>
              <ArrowLeft className="size-4" />
              Go Back
            </span>
          </Button>
          <Button asChild>
            <Link href={href}>{label}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
