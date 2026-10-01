"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Globe2, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<"homeowner" | "tradesperson">("homeowner");

  async function submit(formData: FormData) {
    setLoading(true); setMessage("");
    try {
      const supabase = createClient();
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "");
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard"); router.refresh();
      } else {
        const displayName = String(formData.get("displayName") || "").trim();
        const businessName = String(formData.get("businessName") || "").trim();
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
        if (error) throw error;
        if (data.session) {
          const { error: registrationError } = await supabase.rpc("complete_registration", { account_type: role, chosen_display_name: displayName, chosen_city: null, chosen_business_name: businessName || null });
          if (registrationError) throw registrationError;
          router.push("/dashboard"); router.refresh();
        } else setMessage("Check your inbox to confirm your email, then log in to finish setting up your account.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  }

  async function googleSignIn() {
    setLoading(true); setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` } });
      if (error) throw error;
    } catch (error) { setMessage(error instanceof Error ? error.message : "Google sign-in could not start."); setLoading(false); }
  }

  return (
    <div className="w-full max-w-[480px]">
      <p className="eyebrow">{mode === "login" ? "Welcome back" : "Join Trade Seekerz"}</p>
      <h1 className="mt-3 text-4xl font-black tracking-[-.045em]">{mode === "login" ? "Log in to your account" : "Create your account"}</h1>
      <p className="mt-3 text-sm leading-6 text-[#62708a]">{mode === "login" ? "Manage projects, quotes and messages in one place." : "Homeowners post free. Tradespeople only pay when they want to connect with leads."}</p>
      {mode === "register" && <div className="mt-7 grid grid-cols-2 gap-2 rounded-xl bg-[#eef4fb] p-1.5"><button type="button" onClick={() => setRole("homeowner")} className={`rounded-lg px-3 py-3 text-sm font-extrabold ${role === "homeowner" ? "bg-white text-[#0b68ed] shadow" : "text-[#62708a]"}`}>I’m a homeowner</button><button type="button" onClick={() => setRole("tradesperson")} className={`rounded-lg px-3 py-3 text-sm font-extrabold ${role === "tradesperson" ? "bg-white text-[#0b68ed] shadow" : "text-[#62708a]"}`}>I’m a tradesperson</button></div>}
      <button onClick={googleSignIn} disabled={loading} className="btn-outline mt-6 w-full"><Globe2 size={18}/>Continue with Google</button>
      <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.14em] text-[#9aa6b9]"><span className="h-px flex-1 bg-[#dce4ef]"/>or use email<span className="h-px flex-1 bg-[#dce4ef]"/></div>
      <form action={submit} className="grid gap-4">
        {mode === "register" && <><label className="grid gap-2 text-sm font-bold">Your name<input className="field" name="displayName" minLength={2} required placeholder="Alex Morgan"/></label>{role === "tradesperson" && <label className="grid gap-2 text-sm font-bold">Business name<input className="field" name="businessName" required placeholder="Morgan Builders"/></label>}</>}
        <label className="grid gap-2 text-sm font-bold">Email address<input className="field" type="email" name="email" required placeholder="you@example.co.nz"/></label>
        <label className="grid gap-2 text-sm font-bold">Password<input className="field" type="password" name="password" minLength={8} required placeholder="At least 8 characters"/></label>
        <button className="btn-primary mt-2 w-full" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={18}/> : <>{mode === "login" ? "Log in" : "Create account"}<ArrowRight size={17}/></>}</button>
      </form>
      {message && <p role="status" className="mt-4 rounded-xl bg-[#eef4fb] p-4 text-sm leading-6 text-[#24446f]">{message}</p>}
      <p className="mt-6 text-center text-sm text-[#62708a]">{mode === "login" ? <>New here? <Link className="font-extrabold text-[#0b68ed]" href="/register">Create an account</Link></> : <>Already registered? <Link className="font-extrabold text-[#0b68ed]" href="/login">Log in</Link></>}</p>
      {mode === "register" && <p className="mt-5 text-center text-xs leading-5 text-[#8995a9]">By creating an account, you agree to the <Link href="/terms" className="underline">Marketplace Terms</Link>.</p>}
    </div>
  );
}
