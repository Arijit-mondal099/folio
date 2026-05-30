import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

import { GitHubIcon } from "@/components/github-icon";

const GITHUB_URL = "https://github.com/Arijit-mondal099/folio";

const features = [
  "Unlimited notebooks and notes",
  "All AI features included",
  "Export to PDF, Word, Markdown, HTML, text",
  "Email + Google sign-in",
  "MIT licensed, self-hostable"
];

export default function Pricing() {
  return (
    <section className="bg-background @container py-24" id="pricing">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h2 className="text-balance font-serif text-4xl font-medium">
            Free. Forever.
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            Folio is open source. Use the hosted version at no cost, or
            self-host it yourself.
          </p>
        </div>
        <div className="mt-12">
          <Card className="ring-primary relative flex flex-col p-8 ring-1">
            <div className="text-center">
              <span className="font-serif text-5xl font-medium">$0</span>
              <span className="text-muted-foreground ml-1">/ forever</span>
            </div>
            <ul className="mt-8 space-y-3">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="text-muted-foreground flex items-start gap-2 text-sm"
                >
                  <Check className="text-primary mt-0.5 size-4 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="w-full sm:flex-1">
                <Link href="/signup">Get started</Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:flex-1">
                <Link
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubIcon className="size-4" />
                  Star on GitHub
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
