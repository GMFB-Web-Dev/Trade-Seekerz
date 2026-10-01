import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getR2Client, getR2Config } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  scope: z.enum(["avatar", "project", "portfolio", "message", "quote"]),
  referenceId: z.string().uuid().optional(),
  fileName: z.string().min(1).max(180),
  contentType: z.string().min(1).max(100),
  size: z.number().int().positive(),
});

const rules = {
  avatar: { max: 5_242_880, types: ["image/jpeg", "image/png", "image/webp"] },
  project: { max: 26_214_400, types: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime"] },
  portfolio: { max: 15_728_640, types: ["image/jpeg", "image/png", "image/webp", "video/mp4"] },
  message: { max: 10_485_760, types: ["image/jpeg", "image/png", "image/webp", "application/pdf"] },
  quote: { max: 10_485_760, types: ["image/jpeg", "image/png", "image/webp", "application/pdf"] },
} as const;

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "application/pdf": "pdf",
};

export async function POST(request: Request) {
  try {
    const input = requestSchema.parse(await request.json());
    const rule = rules[input.scope];
    if (input.size > rule.max || !(rule.types as readonly string[]).includes(input.contentType)) {
      return NextResponse.json({ error: "This file type or size is not allowed." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Please sign in to upload files." }, { status: 401 });

    const allowed = await canUpload(supabase, user.id, input.scope, input.referenceId);
    if (!allowed) return NextResponse.json({ error: "You cannot upload files here." }, { status: 403 });

    const folder = `${input.scope}s`;
    const reference = input.referenceId ? `/${input.referenceId}` : "";
    const key = `${folder}/${user.id}${reference}/${crypto.randomUUID()}.${extensions[input.contentType]}`;
    const { bucket } = getR2Config();
    const uploadUrl = await getSignedUrl(
      getR2Client(),
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: input.contentType,
        ContentLength: input.size,
      }),
      { expiresIn: 600 },
    );

    return NextResponse.json({ uploadUrl, key, expiresIn: 600 });
  } catch (error) {
    const message = error instanceof z.ZodError ? "Invalid upload request." : error instanceof Error ? error.message : "Could not prepare upload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

async function canUpload(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  scope: z.infer<typeof requestSchema>["scope"],
  referenceId?: string,
) {
  if (scope === "avatar") return true;

  if (scope === "portfolio") {
    const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
    return data?.role === "tradesperson";
  }

  if (!referenceId) return false;

  if (scope === "project") {
    const { data } = await supabase.from("projects").select("id").eq("id", referenceId).eq("homeowner_id", userId).maybeSingle();
    return Boolean(data);
  }

  if (scope === "message") {
    const { data } = await supabase.from("conversations").select("id").eq("id", referenceId).maybeSingle();
    return Boolean(data);
  }

  const { data } = await supabase.from("quotes").select("id, applications!inner(tradesperson_id)").eq("id", referenceId).eq("applications.tradesperson_id", userId).maybeSingle();
  return Boolean(data);
}
