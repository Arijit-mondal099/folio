import { Card } from "@/components/ui/card";
import { FileDown, PenLine, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: PenLine,
    title: "Capture",
    description:
      "Open a notebook and start writing. Headings, lists, code blocks, links, and the keyboard shortcuts you already know — all work the way you'd expect."
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Refine",
    description:
      "Highlight any passage to fix grammar, sharpen clarity, change tone, or translate. Open the AI sidebar to draft sections — every edit waits for your approval."
  },
  {
    number: "03",
    icon: FileDown,
    title: "Export",
    description:
      "Ship your note as PDF, Word, Markdown, HTML, or plain text. Formatting and code blocks travel intact, no vendor lock-in."
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div>
          <p className="text-primary text-sm font-medium uppercase tracking-wider">
            How it works
          </p>
          <h2 className="text-foreground mt-3 max-w-2xl text-balance text-4xl font-semibold">
            From idea to export in three steps.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl text-balance text-lg">
            The same workflow every time — capture freely, refine with AI, ship
            to any format.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map(({ number, icon: Icon, title, description }) => (
            <Card key={number} className="p-6">
              <p className="text-muted-foreground/40 font-serif text-5xl font-medium leading-none">
                {number}
              </p>
              <div className="bg-primary/10 mt-6 flex size-10 items-center justify-center rounded-lg">
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
      </div>
    </section>
  );
}
