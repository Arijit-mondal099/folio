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
    title: "Notebooks & notes",
    description:
      "Organise everything into notebooks. Search, sort, and jump to what matters in seconds."
  },
  {
    icon: Sparkles,
    title: "AI writing assistant",
    description:
      "A chat sidebar that drafts, rewrites, or extends your note — you review and apply."
  },
  {
    icon: Wand2,
    title: "Inline transforms",
    description:
      "Highlight any text and fix typos, improve clarity, summarise, change tone, or translate."
  },
  {
    icon: FileDown,
    title: "Export anywhere",
    description:
      "One click to Markdown, HTML, plain text, PDF, or Word — preserves headings, lists, and code."
  },
  {
    icon: LayoutDashboard,
    title: "Activity dashboard",
    description:
      "See notes per notebook, recent writing streaks, and your most-used notebook at a glance."
  },
  {
    icon: Moon,
    title: "Dark mode",
    description:
      "A clean light/dark theme that follows your system, with no flash on first paint."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features">
      <div className="py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div>
            <h2 className="text-foreground max-w-2xl text-balance text-4xl font-semibold">
              Everything you need to think on paper.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl text-balance text-lg">
              A focused editor, an assistant that actually helps, and zero
              vendor lock-in.
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
