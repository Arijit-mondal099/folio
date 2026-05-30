import { Logo } from "@/components/logo";
import Link from "next/link";

import { GitHubIcon } from "@/components/github-icon";
import { SITE_NAME } from "@/lib/constants";

const GITHUB_URL = "https://github.com/Arijit-mondal099/folio";

const links = [
  { title: "Features", href: "/#features" },
  { title: "Pricing", href: "/#pricing" },
  { title: "FAQ", href: "/#faq" },
  { title: "Log in", href: "/login" },
  { title: "Sign up", href: "/signup" },
  { title: "GitHub", href: GITHUB_URL }
];

export default function FooterSection() {
  return (
    <footer className="bg-muted py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Link href="/" aria-label="go home" className="mx-auto block size-fit">
          <Logo />
        </Link>

        <div className="my-8 flex flex-wrap justify-center gap-6">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="text-muted-foreground hover:text-primary block duration-150"
            >
              <span>{link.title}</span>
            </Link>
          ))}
        </div>

        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-primary block"
          >
            <GitHubIcon className="size-6" />
          </Link>
        </div>

        <span className="text-muted-foreground block text-center text-sm">
          © {new Date().getFullYear()} {SITE_NAME}. Open source under MIT.
        </span>
      </div>
    </footer>
  );
}
