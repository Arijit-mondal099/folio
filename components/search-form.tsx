"use client";

import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput
} from "@/components/ui/sidebar";
import { SearchIcon } from "lucide-react";

export function SearchForm({
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<"form">, "onChange"> & {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <form {...props} onSubmit={(e) => e.preventDefault()}>
      <SidebarGroup className="p-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search notebooks..."
            className="pl-8"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
