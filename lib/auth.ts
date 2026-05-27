import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db/drizzle";
import { env } from "@/lib/env";
import { schema } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import VerificationEmail from "@/components/emails/verification-email";
import PasswordResetEmail from "@/components/emails/reset-email";
import ExistingUserSignUpEmail from "@/components/emails/existing-user-signup-email";

export const auth = betterAuth({
  // Better auth drizzle ORM
  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),
  // Email & password stratagy
  emailAndPassword: {
    enabled: true,
    // users must verify their email before they can log in
    requireEmailVerification: true,
    onExistingUserSignUp: async ({ user }) => {
      void sendEmail({
        to: user.email,
        subject: "Sign-up attempt with your email",
        react: ExistingUserSignUpEmail({
          userName: user.name,
          loginUrl: env.BETTER_AUTH_URL + "/login"
        })
      });
    },
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        react: PasswordResetEmail({
          userName: user.name,
          resetUrl: url,
          requestTime: new Date().toLocaleString()
        })
      });
    }
  },
  // Google auth stratagy
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  },
  // Email verification
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        react: VerificationEmail({ userName: user.name, verificationUrl: url })
      });
    },
    sendOnSignUp: true,
    expiresIn: 60
  },
  // Now, when you call functions that set cookies, they will be automatically set.
  plugins: [nextCookies()]
});
