import { Mail, MapPin, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ContactForm } from "./contact-form";

export default function ContactPage() {
  return <PageShell>
    <section className="bg-[#f4f8ff] py-20">
      <div className="container-shell grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div><p className="eyebrow">Contact Trade Seekerz</p><h1 className="section-title mt-3">Tell us what you need.</h1><p className="body-copy mt-5">Questions about a project, account, membership, or marketplace safety? Send the support team a note.</p><div className="mt-8 grid gap-4 text-sm font-bold"><span className="flex items-center gap-3"><MapPin className="text-[#0b68ed]" size={19}/>Supporting homeowners and tradies across New Zealand</span><span className="flex items-center gap-3"><Mail className="text-[#0b68ed]" size={19}/>Replies go to the email you provide</span><span className="flex items-center gap-3"><ShieldCheck className="text-[#0b68ed]" size={19}/>Reports are reviewed by the marketplace team</span></div></div>
        <ContactForm />
      </div>
    </section>
  </PageShell>;
}

