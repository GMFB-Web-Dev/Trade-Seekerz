import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data, error } = await createAdminClient()
      .from("categories")
      .select("id,name,slug")
      .eq("active", true)
      .order("name");

    if (error) throw error;

    return NextResponse.json(data ?? [], {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("Category lookup failed", error);
    return NextResponse.json({ error: "Categories are temporarily unavailable." }, { status: 500 });
  }
}
