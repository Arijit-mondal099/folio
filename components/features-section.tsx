import { Card } from "@/components/ui/card";
import {
  BookOpen,
  FileDown,
  LayoutDashboard,
  Moon,
  Sparkles,
  Wand2
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Organised by default",
    description:
      "Group notes into notebooks. Search, sort, and jump to anything in seconds."
  },
  {
    icon: Sparkles,
    title: "An assistant, not a chatbot",
    description:
      "Folio's AI drafts, rewrites, and extends — every change passes through your review before it lands."
  },
  {
    icon: Wand2,
    title: "Transforms, in place",
    description:
      "Highlight any text to fix typos, sharpen clarity, summarise, shift tone, or translate. No round-trips."
  },
  {
    icon: FileDown,
    title: "Export to anything",
    description:
      "Markdown, HTML, plain text, PDF, or Word — formatting preserved, with zero vendor lock-in."
  },
  {
    icon: LayoutDashboard,
    title: "A dashboard that's actually useful",
    description:
      "Notes per notebook, recent writing activity, and your most-used notebook at a glance."
  },
  {
    icon: Moon,
    title: "Dark mode done right",
    description:
      "Light or dark, follows your system preference, with no flash on first paint."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features">
      <div className="py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div>
            <h2 className="text-foreground max-w-2xl text-balance text-4xl font-semibold">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl text-balance text-lg">
              Six features. Each one earns its place — no bloat, no upsell, no
              feature you have to pay extra to unlock.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="overflow-hidden p-6">
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
        </div>
      </div>
    </section>
  );
}
