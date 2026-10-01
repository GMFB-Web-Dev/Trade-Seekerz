import { redirect } from "next/navigation";
import { getViewer } from "@/lib/auth";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{demo?:string}> }) {
  const params = await searchParams;
  const viewer = await getViewer();
  if (viewer?.role === "admin") redirect("/admin");
  if (viewer && (viewer.role === "homeowner" || viewer.role === "tradesperson")) return <DashboardClient role={viewer.role} name={viewer.displayName || "there"}/>;
  if (params.demo === "homeowner" || params.demo === "tradesperson") return <DashboardClient role={params.demo} name={params.demo === "homeowner" ? "Taylor" : "Alex"} demo/>;
  redirect("/login");
}

