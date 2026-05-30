import type { Metadata } from "next";

import { LoginForm } from "@/components/form/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to folio to access your notebooks and notes.",
  alternates: { canonical: "/login" }
};

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
