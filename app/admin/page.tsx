import { redirect } from "next/navigation";
import { getViewer } from "@/lib/auth";
import { AdminClient, type AdminTab } from "./admin-client";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{demo?:string;tab?:string}> }) {
  const params=await searchParams; const viewer=await getViewer();const tabs:AdminTab[]=["overview","moderation","users","projects","billing"];const initialTab=tabs.includes(params.tab as AdminTab)?params.tab as AdminTab:"overview";
  if (viewer?.role === "admin") return <AdminClient name={viewer.displayName || "Admin"} initialTab={initialTab}/>;
  if (params.demo === "1") return <AdminClient name="Operations" demo initialTab={initialTab}/>;
  redirect("/login");
}
