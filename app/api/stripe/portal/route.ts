import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe";

export async function POST(){try{const supabase=await createClient();const{data}=await supabase.auth.getClaims();const userId=data?.claims?.sub;if(typeof userId!=="string")return NextResponse.json({error:"Please log in."},{status:401});const{data:record}=await supabase.from("subscriptions").select("stripe_customer_id").eq("user_id",userId).maybeSingle();if(!record?.stripe_customer_id)return NextResponse.json({error:"No billing profile exists yet."},{status:404});const session=await getStripeClient().billingPortal.sessions.create({customer:record.stripe_customer_id,return_url:`${process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"}/pricing`});return NextResponse.json({url:session.url});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Billing portal could not be opened."},{status:400})}}

