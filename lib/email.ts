import { Resend } from "resend";
import { env } from "@/lib/env";
import { toast } from "sonner";

const resend = new Resend(env.RESEND_API_KEY);

type Params = {
  to: string;
  subject: string;
  react: React.ReactNode;
};

export const sendEmail = async ({
  to,
  subject,
  react
}: Params): Promise<void> => {
  try {
    const { error } = await resend.emails.send({
      from: "Folio <onboarding@resend.dev>",
      to: [to],
      subject,
      react
    });

    if (error) {
      toast.error(error.message);
    }
  } catch (error: unknown) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Faild to send email please try again!"
    );
  }
};
