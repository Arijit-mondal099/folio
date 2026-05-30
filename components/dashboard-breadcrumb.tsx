"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { useNotebook } from "@/lib/notebook-queries";
import { useNote } from "@/lib/note-queries";

const ROUTE_LABELS: Record<string, string> = {
  "change-password": "Change Password",
  "forgot-password": "Forgot Password",
  "reset-password": "Reset Password"
};

export function DashboardBreadcrumb() {
  const pathname = usePathname() ?? "";
  const segments = pathname.split("/").filter(Boolean);

  const notebookId = segments[1] === "notebooks" ? segments[2] : undefined;
  const noteId = segments[3] === "notes" ? segments[4] : undefined;

  const notebook = useNotebook(notebookId ?? "");
  const note = useNote(notebookId ?? "", noteId ?? "");

  const crumbs: Array<{ label: string; href?: string }> = [
    { label: "Dashboard", href: "/dashboard" }
  ];

  if (segments[1] === "notebooks" && notebookId) {
    crumbs.push({
      label: notebook.data?.name ?? "Notebook",
      href: noteId ? `/dashboard/notebooks/${notebookId}` : undefined
    });

    if (noteId) {
      crumbs.push({
        label: note.data?.title ?? "Note"
      });
    }
  } else if (segments[1]) {
    crumbs.push({
      label: ROUTE_LABELS[segments[1]] ?? toTitle(segments[1])
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <BreadcrumbFragment
              key={`${crumb.label}-${idx}`}
              crumb={crumb}
              isLast={isLast}
              showSeparator={idx > 0}
            />
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function BreadcrumbFragment({
  crumb,
  isLast,
  showSeparator
}: {
  crumb: { label: string; href?: string };
  isLast: boolean;
  showSeparator: boolean;
}) {
  return (
    <>
      {showSeparator && <BreadcrumbSeparator className="hidden md:block" />}
      <BreadcrumbItem className={isLast ? "" : "hidden md:block"}>
        {isLast || !crumb.href ? (
          <BreadcrumbPage className="truncate max-w-50">
            {crumb.label}
          </BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild className="truncate max-w-50">
            <Link href={crumb.href}>{crumb.label}</Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    </>
  );
}

function toTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
