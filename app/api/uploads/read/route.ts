import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { getR2Client, getR2Config } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const key = new URL(request.url).searchParams.get("key") ?? "";
    if (!isSafeKey(key)) return NextResponse.json({ error: "Invalid media key." }, { status: 400 });

    const supabase = await createClient();
    if (!(await canRead(supabase, key))) {
      return NextResponse.json({ error: "This file is not available to you." }, { status: 403 });
    }

    const { bucket } = getR2Config();
    const url = await getSignedUrl(getR2Client(), new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 300 });
    return NextResponse.redirect(url, 302);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not open this file.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

async function canRead(supabase: Awaited<ReturnType<typeof createClient>>, key: string) {
  if (key.startsWith("avatars/")) {
    const { data } = await supabase.from("profiles").select("id").eq("avatar_path", key).maybeSingle();
    return Boolean(data);
  }

  if (key.startsWith("portfolios/")) {
    const { data } = await supabase.from("tradesperson_profiles").select("user_id").contains("gallery_paths", [key]).maybeSingle();
    return Boolean(data);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  if (key.startsWith("projects/")) {
    const { data } = await supabase.from("project_media").select("id").eq("storage_path", key).maybeSingle();
    return Boolean(data);
  }

  if (key.startsWith("messages/")) {
    const { data } = await supabase.from("messages").select("id").contains("attachment_paths", [key]).maybeSingle();
    return Boolean(data);
  }

  if (key.startsWith("quotes/")) {
    const { data } = await supabase.from("quotes").select("id").contains("attachment_paths", [key]).maybeSingle();
    return Boolean(data);
  }

  return false;
}

function isSafeKey(key: string) {
  return key.length > 10 && key.length < 500 && !key.includes("..") && /^(avatars|projects|portfolios|messages|quotes)\/[a-zA-Z0-9/_.-]+$/.test(key);
}

