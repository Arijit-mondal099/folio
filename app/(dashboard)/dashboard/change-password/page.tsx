import type { Metadata } from "next";

import { ChangePasswordForm } from "./change-password-form";

export const metadata: Metadata = {
  title: "Change password",
  description: "Update the password on your folio account.",
  robots: { index: false, follow: false }
};

export default function ChangePasswordPage() {
  return <ChangePasswordForm />;
}
