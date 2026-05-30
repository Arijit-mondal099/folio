import Link from "next/link";

import { GitHubIcon } from "@/components/github-icon";
import { Button } from "@/components/ui/button";

const GITHUB_URL = "https://github.com/Arijit-mondal099/folio";

export default function FinalCtaSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="bg-muted rounded-3xl px-6 py-16 text-center sm:px-12">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Start writing today.
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            It&apos;s free. It&apos;s open source. It&apos;s already there in
            your browser.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/signup">Sign up — free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <GitHubIcon className="size-4" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
