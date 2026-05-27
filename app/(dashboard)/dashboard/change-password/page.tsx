"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  changePasswordSchema,
  type ChangePasswordData
} from "@/schema/auth.schema";
import { authClient } from "@/lib/auth-client";

export default function ChangePasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    }
  });

  async function onSubmit(values: ChangePasswordData) {
    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword
    });
    if (error) {
      toast.error(error.message ?? "Failed to change password");
    } else {
      toast.success("Password changed successfully");
      reset();
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex w-full items-start justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Enter your current password and choose a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="currentPassword">
                    Current Password
                  </FieldLabel>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="********"
                    aria-invalid={!!errors.currentPassword}
                    {...register("currentPassword")}
                  />
                  {errors.currentPassword && (
                    <FieldError>{errors.currentPassword.message}</FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="********"
                    aria-invalid={!!errors.newPassword}
                    {...register("newPassword")}
                  />
                  {errors.newPassword ? (
                    <FieldError>{errors.newPassword.message}</FieldError>
                  ) : (
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmNewPassword">
                    Confirm New Password
                  </FieldLabel>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    placeholder="********"
                    aria-invalid={!!errors.confirmNewPassword}
                    {...register("confirmNewPassword")}
                  />
                  {errors.confirmNewPassword ? (
                    <FieldError>{errors.confirmNewPassword.message}</FieldError>
                  ) : (
                    <FieldDescription>
                      Please confirm your new password.
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    {isSubmitting ? "Changing Password..." : "Change Password"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
