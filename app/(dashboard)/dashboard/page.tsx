import type { Metadata } from "next";

import { DashboardView } from "./dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your folio dashboard.",
  robots: { index: false, follow: false }
};

export default function Dashboard() {
  return <DashboardView />;
}
