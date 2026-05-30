import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind
} from "@react-email/components";

import { SITE_NAME } from "@/lib/constants";

interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
  requestTime: string;
}

const PasswordResetEmail = ({
  userName,
  resetUrl,
  requestTime
}: PasswordResetEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your {SITE_NAME} password</Preview>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-150 mx-auto p-10">
            <Section className="text-center mb-8">
              <Text className="text-[24px] font-bold text-gray-900 m-0">
                Reset Your Password
              </Text>
            </Section>

            <Section className="mb-8">
              <Text className="text-[16px] text-gray-700 leading-6 mb-4">
                Hi {userName},
              </Text>
              <Text className="text-[16px] text-gray-700 leading-6 mb-4">
                We received a request to reset your password {requestTime}. If
                you made this request, click the button below to create a new
                password.
              </Text>
              <Text className="text-[16px] text-gray-700 leading-6 mb-6">
                This password reset link will expire in 1 hour for your
                security.
              </Text>
            </Section>

            <Section className="text-center mb-8">
              <Button
                href={resetUrl}
                className="bg-red-600 text-white px-8 py-3 rounded-[6px] text-[16px] font-semibold no-underline box-border"
              >
                Reset Password
              </Button>
            </Section>

            <Section className="mb-8">
              <Text className="text-[14px] text-gray-600 leading-5 mb-2">
                If the button doesn&apos;t work, you can copy and paste this
                link into your browser:
              </Text>
              <Text className="text-[14px] text-blue-600 break-all">
                {resetUrl}
              </Text>
            </Section>

            <Hr className="border-gray-200 my-6" />

            <Section className="mb-6">
              <Text className="text-[14px] text-gray-600 leading-5 mb-4">
                <strong>Security Notice:</strong>
              </Text>
              <Text className="text-[14px] text-gray-600 leading-5 mb-3">
                • If you didn&apos;t request a password reset, please ignore
                this email. Your password will remain unchanged.
              </Text>
              <Text className="text-[14px] text-gray-600 leading-5 mb-3">
                • For your security, this link can only be used once and expires
                in 1 hour.
              </Text>
              <Text className="text-[14px] text-gray-600 leading-5 mb-3">
                • If you continue to receive these emails, please contact our
                support team immediately.
              </Text>
            </Section>

            <Section className="border-t border-gray-200 pt-6">
              <Text className="text-[12px] text-gray-500 leading-4 m-0">
                © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;
