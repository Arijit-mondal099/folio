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

interface VerificationEmailProps {
  userName: string;
  verificationUrl: string;
}

const VerificationEmail = ({
  userName,
  verificationUrl
}: VerificationEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Verify your {SITE_NAME} email address</Preview>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-150 mx-auto p-10">
            <Section className="text-center mb-8">
              <Text className="text-[24px] font-bold text-gray-900 m-0">
                Verify Your Email Address
              </Text>
            </Section>

            <Section className="mb-8">
              <Text className="text-[16px] text-gray-700 leading-6 mb-4">
                Hi {userName},
              </Text>
              <Text className="text-[16px] text-gray-700 leading-6 mb-4">
                Thank you for signing up! To complete your account setup and
                start using {SITE_NAME}, please verify your email address by
                clicking the button below.
              </Text>
              <Text className="text-[16px] text-gray-700 leading-6 mb-6">
                This verification link will expire in 24 hours for security
                purposes.
              </Text>
            </Section>

            <Section className="text-center mb-8">
              <Button
                href={verificationUrl}
                className="bg-blue-600 text-white px-8 py-3 rounded-[6px] text-[16px] font-semibold no-underline box-border"
              >
                Verify Email Address
              </Button>
            </Section>

            <Section className="mb-8">
              <Text className="text-[14px] text-gray-600 leading-5 mb-2">
                If the button doesn&apos;t work, you can copy and paste this
                link into your browser:
              </Text>
              <Text className="text-[14px] text-blue-600 break-all">
                {verificationUrl}
              </Text>
            </Section>

            <Hr className="border-gray-200 my-6" />

            <Section className="mb-6">
              <Text className="text-[14px] text-gray-600 leading-5 mb-2">
                <strong>Security Notice:</strong>
              </Text>
              <Text className="text-[14px] text-gray-600 leading-5">
                If you didn&apos;t create an account with {SITE_NAME}, please
                ignore this email. Your email address will not be added to our
                system without verification.
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

export default VerificationEmail;
