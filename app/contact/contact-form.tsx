"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const form = new FormData(event.currentTarget);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const name = String(form.get("name") ?? "").trim();
      const body = String(form.get("message") ?? "").trim();
      const { error } = await supabase.from("feedback").insert({
        user_id: user?.id ?? null,
        email: String(form.get("email") ?? "").trim(),
        message: name ? `From ${name}: ${body}` : body,
      });
      if (error) throw error;
      event.currentTarget.reset();
      setSuccess(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not send your message.");
    } finally {
      setLoading(false);
    }
  }

  return <form onSubmit={submit} className="card p-6 sm:p-9">
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-bold">Name<input className="field" name="name" autoComplete="name" required /></label>
      <label className="grid gap-2 text-sm font-bold">Email<input className="field" name="email" type="email" autoComplete="email" required /></label>
      <label className="grid gap-2 text-sm font-bold sm:col-span-2">How can we help?<textarea className="field" name="message" minLength={10} maxLength={2900} required /></label>
    </div>
    <button className="btn-primary mt-6" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={18} /> : <Send size={17} />} Send message</button>
    {success && <p className="mt-5 rounded-xl bg-[#e9f8f1] p-4 text-sm font-bold text-[#0d8154]">Thanks — your message is safely in our support queue.</p>}
    {message && <p className="mt-5 rounded-xl bg-[#fff0ef] p-4 text-sm text-[#a43d3d]">{message}</p>}
  </form>;
}

