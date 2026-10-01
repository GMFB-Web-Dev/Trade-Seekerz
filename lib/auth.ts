import "server-only";
import { createClient } from "@/lib/supabase/server";

export type Viewer = {
  id: string;
  email: string | null;
  role: "homeowner" | "tradesperson" | "admin";
  displayName: string;
  onboardingCompleted: boolean;
};

export async function getViewer(): Promise<Viewer | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const subject = claims?.sub;
  if (error || !claims || typeof subject !== "string") return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name, onboarding_completed")
    .eq("id", subject)
    .maybeSingle();

  if (!profile) return null;
  return {
    id: subject,
    email: typeof claims.email === "string" ? claims.email : null,
    role: profile.role as Viewer["role"],
    displayName: profile.display_name,
    onboardingCompleted: profile.onboarding_completed,
  };
}
