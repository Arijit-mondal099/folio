"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import Link from "next/link";

const GITHUB_URL = "https://github.com/Arijit-mondal099/folio";

const faqItems = [
  {
    id: "item-1",
    question: "Is folio really free?",
    answer:
      "Yes. Folio is MIT-licensed. You can use the hosted version free of charge, or clone the repo and self-host it on your own infrastructure."
  },
  {
    id: "item-2",
    question: "Which AI model does it use?",
    answer:
      "The chat assistant and the inline transforms run on Groq's Qwen3-32B by default. If you self-host, you can swap the model by changing DEFAULT_MODEL in lib/llm.ts."
  },
  {
    id: "item-3",
    question: "Where are my notes stored?",
    answer:
      "In a PostgreSQL database. The hosted version uses Neon; self-hosted setups can point at any Postgres instance via the DATABASE_URL env var."
  },
  {
    id: "item-4",
    question: "Can I export my notes?",
    answer:
      "Yes — Markdown, HTML, plain text, PDF, and Word, all from the editor toolbar. No vendor lock-in, and exports preserve headings, lists, and code blocks."
  },
  {
    id: "item-5",
    question: "How do I run it myself?",
    answer:
      "Clone the GitHub repo, set the env vars (DATABASE_URL, GROQ_API_KEY, BETTER_AUTH_*, Google OAuth keys, NEXT_PUBLIC_SITE_URL), then run pnpm install && pnpm dev. The README has the full setup guide."
  }
];

export default function FAQsTwo() {
  return (
    <section className="py-16 md:py-24" id="faq">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground mt-4 text-balance">
            Quick answers about how folio works, where your notes live, and how
            to run it yourself.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed"
              >
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-muted-foreground mt-6 px-8">
            Still have questions? Open an issue on{" "}
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
