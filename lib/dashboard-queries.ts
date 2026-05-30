"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardStats } from "@/server/dashboard";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const result = await getDashboardStats();
      if (!result.success) throw new Error(result.message);
      if (!result.data) throw new Error("No dashboard data");
      return result.data;
    }
  });
}
