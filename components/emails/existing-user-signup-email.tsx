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

interface ExistingUserSignUpEmailProps {
  userName: string;
  loginUrl: string;
}

const ExistingUserSignUpEmail = ({
  userName,
  loginUrl
}: ExistingUserSignUpEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Someone tried to sign up with your {SITE_NAME} email</Preview>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-150 mx-auto p-10">
            <Section className="text-center mb-8">
              <Text className="text-[24px] font-bold text-gray-900 m-0">
                Sign-up Attempt Detected
              </Text>
            </Section>

            <Section className="mb-8">
              <Text className="text-[16px] text-gray-700 leading-6 mb-4">
                Hi {userName},
              </Text>
              <Text className="text-[16px] text-gray-700 leading-6 mb-4">
                Someone tried to create a new account using your email address.
                Since you already have a {SITE_NAME} account, no new account was
                created.
              </Text>
              <Text className="text-[16px] text-gray-700 leading-6 mb-6">
                If this was you, you can sign in to your existing account
                instead.
              </Text>
            </Section>

            <Section className="text-center mb-8">
              <Button
                href={loginUrl}
                className="bg-blue-600 text-white px-8 py-3 rounded-[6px] text-[16px] font-semibold no-underline box-border"
              >
                Sign In to Your Account
              </Button>
            </Section>

            <Hr className="border-gray-200 my-6" />

            <Section className="mb-6">
              <Text className="text-[14px] text-gray-600 leading-5 mb-2">
                <strong>Security Notice:</strong>
              </Text>
              <Text className="text-[14px] text-gray-600 leading-5">
                If you didn&apos;t try to sign up, you can safely ignore this
                email. Your existing account and password have not been
                affected.
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

export default ExistingUserSignUpEmail;
