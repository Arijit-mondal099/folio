"use client";

import * as React from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton({
  callbackURL = "/dashboard",
  children = "Continue with Google"
}: {
  callbackURL?: string;
  children?: React.ReactNode;
}) {
  const [pending, setPending] = React.useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signIn.social(
          { provider: "google", callbackURL },
          { onError: () => setPending(false) }
        );
      }}
    >
      {children}
    </Button>
  );
}
