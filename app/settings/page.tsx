import { redirect } from "next/navigation";
import { getViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const viewer=await getViewer();if(!viewer||viewer.role==="admin")redirect("/login");const supabase=await createClient();const{data}=await supabase.from("profiles").select("city, avatar_path").eq("id",viewer.id).single();return <SettingsClient userId={viewer.id} role={viewer.role} displayName={viewer.displayName} city={data?.city??""} avatarPath={data?.avatar_path??null}/>;
}

