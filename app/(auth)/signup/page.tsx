import type { Metadata } from "next";

import { SignupForm } from "@/components/form/signup-form";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create a free folio account and start writing notes with AI assistance.",
  alternates: { canonical: "/signup" }
};

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
