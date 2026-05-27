"use client";

import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
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
import {
  ChevronRightIcon,
  Ellipsis,
  LogOut,
  Monitor,
  Settings
} from "lucide-react";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#"
        },
        {
          title: "Project Structure",
          url: "#"
        }
      ]
    },
    {
      title: "Build Your Application",
      url: "#",
      items: [
        {
          title: "Routing",
          url: "#"
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true
        },
        {
          title: "Rendering",
          url: "#"
        },
        {
          title: "Caching",
          url: "#"
        },
        {
          title: "Styling",
          url: "#"
        },
        {
          title: "Optimizing",
          url: "#"
        },
        {
          title: "Configuring",
          url: "#"
        },
        {
          title: "Testing",
          url: "#"
        },
        {
          title: "Authentication",
          url: "#"
        },
        {
          title: "Deploying",
          url: "#"
        },
        {
          title: "Upgrading",
          url: "#"
        },
        {
          title: "Examples",
          url: "#"
        }
      ]
    },
    {
      title: "API Reference",
      url: "#",
      items: [
        {
          title: "Components",
          url: "#"
        },
        {
          title: "File Conventions",
          url: "#"
        },
        {
          title: "Functions",
          url: "#"
        },
        {
          title: "next.config.js Options",
          url: "#"
        },
        {
          title: "CLI",
          url: "#"
        },
        {
          title: "Edge Runtime",
          url: "#"
        }
      ]
    },
    {
      title: "Architecture",
      url: "#",
      items: [
        {
          title: "Accessibility",
          url: "#"
        },
        {
          title: "Fast Refresh",
          url: "#"
        },
        {
          title: "Next.js Compiler",
          url: "#"
        },
        {
          title: "Supported Browsers",
          url: "#"
        },
        {
          title: "Turbopack",
          url: "#"
        }
      ]
    },
    {
      title: "Community",
      url: "#",
      items: [
        {
          title: "Contribution Guide",
          url: "#"
        }
      ]
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

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
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {item.title}{" "}
                  <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
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
