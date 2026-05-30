import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Sparkle } from "lucide-react";

import { GitHubIcon } from "@/components/github-icon";

const GITHUB_URL = "https://github.com/Arijit-mondal099/folio";

export default function HeroSection() {
  return (
    <>
      <main>
        <section className="before:bg-muted border-e-foreground relative overflow-hidden before:absolute before:inset-1 before:h-[calc(100%-8rem)] before:rounded-2xl sm:before:inset-2 md:before:rounded-[2rem] lg:before:h-[calc(100%-14rem)]">
          <div className="py-20 md:py-36">
            <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
              <div>
                <Link
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-foreground/5 mx-auto flex w-fit items-center justify-center gap-2 rounded-md py-0.5 pl-1 pr-3 transition-colors duration-150"
                >
                  <div
                    aria-hidden
                    className="border-background bg-linear-to-b dark:inset-shadow-2xs to-foreground from-primary relative flex size-5 items-center justify-center rounded border shadow-md shadow-black/20 ring-1 ring-black/10"
                  >
                    <div className="absolute inset-x-0 inset-y-1.5 border-y border-dotted border-background/25"></div>
                    <div className="absolute inset-x-1.5 inset-y-0 border-x border-dotted border-background/25"></div>
                    <Sparkle className="fill-background stroke-background size-3 drop-shadow" />
                  </div>
                  <span className="font-medium">
                    Open source · MIT licensed
                  </span>
                </Link>
                <h1 className="mx-auto mt-8 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                  The note app for thinking, drafting, and shipping.
                </h1>
                <p className="text-muted-foreground mx-auto my-6 max-w-2xl text-balance text-xl">
                  A focused editor with a built-in AI assistant. Capture ideas,
                  refine them in place, and export to PDF, Word, Markdown, HTML,
                  or plain text — free, open source, and yours to extend.
                </p>

                <div className="flex items-center justify-center gap-3">
                  <Button asChild size="lg">
                    <Link href="/signup">
                      <span className="text-nowrap">Start writing — free</span>
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GitHubIcon className="size-4" />
                      <span className="text-nowrap">View on GitHub</span>
                    </Link>
                  </Button>
                </div>
                <p className="text-muted-foreground mt-5 text-sm">
                  No credit card. No trials. Sign in with email or Google.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 mx-auto max-w-5xl px-6">
                <div className="mt-12 md:mt-16">
                  <div className="bg-background rounded-(--radius) relative mx-auto overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
                    <Image
                      src="/hero.webp"
                      alt="folio editor preview"
                      width="2880"
                      height="1842"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
