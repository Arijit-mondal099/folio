import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/form/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your folio account.",
  robots: { index: false, follow: false }
};

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
