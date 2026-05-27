import { z } from "zod";

const envSchema = z.object({
  BETTER_AUTH_SECRET: z
    .string()
    .min(1, { error: "BETTER_AUTH_SECRET isn't provided" }),
  BETTER_AUTH_URL: z
    .string()
    .min(1, { error: "BETTER_AUTH_URL isn't provided" }),
  DATABASE_URL: z.string().min(1, { error: "DATABASE_URL isn't provided" }),
  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, { error: "GOOGLE_CLIENT_ID isn't provided" }),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, { error: "GOOGLE_CLIENT_SECRET isn't provided" }),
  RESEND_API_KEY: z.string().min(1, { error: "RESEND_API_KEY isn't provided" })
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");
  console.error(z.prettifyError(parsedEnv.error));
  process.exit(1);
}

export const env = parsedEnv.data;
