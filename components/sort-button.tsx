"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ } from "lucide-react";

export type SortMode = "name-asc" | "name-desc" | "date-new" | "date-old";

export function SortButton({
  value,
  onChange,
  ariaLabel = "Sort"
}: {
  value: SortMode;
  onChange: (value: SortMode) => void;
  ariaLabel?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="shrink-0 p-4"
          aria-label={ariaLabel}
        >
          <ArrowDownAZ className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(v) => onChange(v as SortMode)}
        >
          <DropdownMenuRadioItem value="name-asc">
            Name (A–Z)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name-desc">
            Name (Z–A)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date-new">
            Newest first
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date-old">
            Oldest first
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
