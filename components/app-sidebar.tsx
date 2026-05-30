"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/search-form";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SettingsSheet } from "@/components/settings-sheet";
import { Ellipsis, LogOut, Monitor, Plus, Settings } from "lucide-react";
import { CreateNoteBook } from "@/components/form/create-notebook";
import { AppSidebarContent } from "./app-sidebar-content";
import { SortButton, type SortMode } from "@/components/sort-button";
import Image from "next/image";
import { LOGO_IMAGE, SITE_NAME } from "@/lib/constants";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [sortMode, setSortMode] = React.useState<SortMode>("date-new");
  const [searchQuery, setSearchQuery] = React.useState("");

  async function handleLogout() {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.replace("/");
    } catch {
      toast.error("Failed to logout, please try again");
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="cursor-default hover:bg-transparent"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Image
                  src={LOGO_IMAGE}
                  width={100}
                  height={100}
                  className="w-full h-full"
                  alt="Logo"
                />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">{SITE_NAME}</span>
                <span className="text-xs text-muted-foreground">Note App</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        <div className="flex flex-col gap-2 px-2">
          <CreateNoteBook>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="size-4" />
              Create Notebook
            </Button>
          </CreateNoteBook>
          <div className="flex items-center gap-2">
            <SearchForm
              className="flex-1"
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <SortButton
              value={sortMode}
              onChange={setSortMode}
              ariaLabel="Sort notebooks"
            />
          </div>
        </div>
      </SidebarHeader>

      <AppSidebarContent sortMode={sortMode} searchQuery={searchQuery} />

      <SidebarRail />

      <SidebarFooter className="border-t border-dashed">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto py-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-medium">
                    {session?.user.name?.charAt(0).toUpperCase() ?? "?"}
                  </span>
                  <span className="truncate font-medium">
                    {session?.user.name ?? "Account"}
                  </span>
                  <Ellipsis className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{session?.user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {session?.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Monitor className="size-4" />
                    Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={theme}
                      onValueChange={setTheme}
                    >
                      <DropdownMenuRadioItem value="system">
                        System
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="light">
                        Light
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark">
                        Dark
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <SettingsSheet>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Settings className="size-4" />
                    Settings
                  </DropdownMenuItem>
                </SettingsSheet>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
