import Link from "next/link";

import { GitHubIcon } from "@/components/github-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCheck, Code, Lock } from "lucide-react";

const GITHUB_URL = "https://github.com/Arijit-mondal099/folio";

const principles = [
  {
    icon: Lock,
    title: "No lock-in",
    description:
      "Export your notes to any format, any time. If folio disappeared tomorrow, your data wouldn't."
  },
  {
    icon: Code,
    title: "No surprises",
    description:
      "Inspect the code that touches your notes. File issues, send PRs, fork freely."
  },
  {
    icon: CheckCheck,
    title: "No paywalls",
    description:
      "Every feature, every export format, every notebook — included by default, no upsell."
  }
];

export default function OpenSourceSection() {
  return (
    <section id="open-source" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div>
          <p className="text-primary text-sm font-medium uppercase tracking-wider">
            Open source, on purpose
          </p>
          <h2 className="text-foreground mt-3 max-w-2xl text-balance text-4xl font-semibold">
            Three things that won&apos;t change.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl text-balance text-lg">
            Folio is MIT-licensed and the source lives on GitHub. That&apos;s
            not a marketing line — it has concrete consequences.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="p-6">
              <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                <Icon className="text-primary size-5" />
              </div>
              <h3 className="text-foreground mt-5 text-lg font-semibold">
                {title}
              </h3>
              <p className="text-muted-foreground mt-3 text-balance">
                {description}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="size-4" />
              Explore the source on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
