"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";
import { BookOpen, Crown, FileText, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { CreateNoteBook } from "@/components/form/create-notebook";
import { SITE_NAME } from "@/lib/constants";
import { useDashboardStats } from "@/lib/dashboard-queries";

export function DashboardView() {
  const { data, isLoading, isError, error } = useDashboardStats();

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="flex min-h-[40svh] items-center justify-center text-sm text-muted-foreground">
        {error instanceof Error ? error.message : "Failed to load dashboard"}
      </div>
    );
  }

  if (!data) return null;

  const hasContent = data.totalNotebooks > 0 || data.totalNotes > 0;

  if (!hasContent) return <DashboardEmpty />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your notebooks and recent activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Notebooks"
          value={data.totalNotebooks}
          icon={<BookOpen className="size-4 text-muted-foreground" />}
        />
        <KpiCard
          label="Total Notes"
          value={data.totalNotes}
          icon={<FileText className="size-4 text-muted-foreground" />}
        />
        <KpiCard
          label="Notes This Week"
          value={data.notesThisWeek}
          icon={<TrendingUp className="size-4 text-muted-foreground" />}
        />
        <KpiCard
          label="Most Active"
          value={data.mostActiveNotebook?.name ?? "—"}
          hint={
            data.mostActiveNotebook
              ? `${data.mostActiveNotebook.count} ${data.mostActiveNotebook.count === 1 ? "note" : "notes"}`
              : "No notes yet"
          }
          icon={<Crown className="size-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes per Notebook</CardTitle>
          </CardHeader>
          <CardContent>
            <NotesPerNotebookChart data={data.notesPerNotebook} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Notes Over Time (last 14 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NotesOverTimeChart data={data.notesPerDay} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recently edited</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent notes.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {data.recentNotes.map((note) => (
                <li
                  key={note.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {note.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {note.notebookName} · Updated{" "}
                        {formatRelativeTime(note.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link
                      href={`/dashboard/notebooks/${note.notebookId}/notes/${note.id}`}
                    >
                      View
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
  icon
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-1">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="truncate text-2xl font-semibold tracking-tight">
          {value}
        </p>
        {hint && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

const notesPerNotebookConfig = {
  count: { label: "Notes", color: "var(--primary)" }
} satisfies ChartConfig;

function NotesPerNotebookChart({
  data
}: {
  data: Array<{ id: string; name: string; count: number }>;
}) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No notebooks yet.
      </p>
    );
  }

  return (
    <ChartContainer config={notesPerNotebookConfig} className="h-60 w-full">
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) =>
            value.length > 12 ? `${value.slice(0, 12)}…` : value
          }
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={28}
          allowDecimals={false}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

const notesOverTimeConfig = {
  count: { label: "Notes", color: "var(--primary)" }
} satisfies ChartConfig;

function NotesOverTimeChart({
  data
}: {
  data: Array<{ date: string; count: number }>;
}) {
  return (
    <ChartContainer config={notesOverTimeConfig} className="h-60 w-full">
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="notesArea" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-count)"
              stopOpacity={0.4}
            />
            <stop
              offset="100%"
              stopColor="var(--color-count)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => {
            const d = new Date(value);
            return d.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric"
            });
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={28}
          allowDecimals={false}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                typeof value === "string"
                  ? new Date(value).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric"
                    })
                  : ""
              }
            />
          }
        />
        <Area
          dataKey="count"
          stroke="var(--color-count)"
          strokeWidth={2}
          fill="url(#notesArea)"
          type="monotone"
        />
      </AreaChart>
    </ChartContainer>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-75 w-full" />
        <Skeleton className="h-75 w-full" />
      </div>
      <Skeleton className="h-65 w-full" />
    </div>
  );
}

function DashboardEmpty() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your notebooks and recent activity.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <BookOpen className="size-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">Welcome to {SITE_NAME}</p>
          <p className="text-sm text-muted-foreground">
            Create your first notebook to start tracking notes and activity.
          </p>
        </div>
        <CreateNoteBook>
          <Button>Create Notebook</Button>
        </CreateNoteBook>
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}
