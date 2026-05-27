"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function signUp(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password
      },
      headers: await headers()
    });

    return { success: true, message: "Sign Up successful" };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Sign Up failed, please try again!"
    };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password
      },
      headers: await headers()
    });

    return { success: true, message: "Sign In successful" };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Sign In failed, please try again!"
    };
  }
}
