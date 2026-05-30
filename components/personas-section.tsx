import { Card } from "@/components/ui/card";
import { Code, GraduationCap, Microscope, PenLine } from "lucide-react";

const personas = [
  {
    icon: PenLine,
    title: "Writers",
    description:
      "Drafting essays, fiction, or long-form articles. Tone and clarity tools help you ship a clean draft, faster."
  },
  {
    icon: GraduationCap,
    title: "Students",
    description:
      "Class notes, study guides, and summaries. AI summarisation and translation cover the languages your syllabus doesn't."
  },
  {
    icon: Microscope,
    title: "Researchers",
    description:
      "A clean home for source notes and synthesis. Export to PDF or Word when it's time to share with collaborators."
  },
  {
    icon: Code,
    title: "Builders",
    description:
      "Spec docs, README drafts, and meeting notes. Self-host on your own Postgres for privacy and full control."
  }
];

export default function PersonasSection() {
  return (
    <section id="for" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div>
          <p className="text-primary text-sm font-medium uppercase tracking-wider">
            Built for
          </p>
          <h2 className="text-foreground mt-3 max-w-2xl text-balance text-4xl font-semibold">
            Whoever you write for.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl text-balance text-lg">
            Folio adapts to the work — long-form, study, research, or shipping
            software.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {personas.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="p-6">
              <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                <Icon className="text-primary size-5" />
              </div>
              <h3 className="text-foreground mt-5 text-lg font-semibold">
                {title}
              </h3>
              <p className="text-muted-foreground mt-3 text-balance text-sm">
                {description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
