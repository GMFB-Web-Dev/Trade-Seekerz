import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/page-shell";

const sections = [
  ["1. What Trade Seekerz is", "Trade Seekerz is a marketplace that helps people posting jobs connect with tradespeople seeking work. Trade Seekerz is not a party to the service contract formed between those users and does not perform or supervise the work."],
  ["2. Accounts and eligibility", "You must provide accurate details, keep your login secure, and use the marketplace lawfully. Tradespeople are responsible for maintaining the licences, registrations, insurance, and qualifications required for their services."],
  ["3. Listings, quotes, and hiring", "Job posters are responsible for their project information and hiring decision. Tradespeople are responsible for their applications and quotes. Scope, price, timing, variations, payment, health and safety, and completion terms should be agreed directly between the parties."],
  ["4. Memberships and credits", "Paid memberships and credits apply to job seekers. Plan entitlements, renewal, cancellation, expiry, and any credit rules shown at purchase form part of the agreement. Credits have no cash value and are not transferable unless Trade Seekerz expressly agrees."],
  ["5. Payments", "Stripe processes membership and credit payments. Payment details are handled under Stripe’s terms and privacy practices. Payment for trade work is arranged directly between users unless Trade Seekerz introduces a separate payment product."],
  ["6. Verification and safety", "Profile or identity checks reduce risk but are not a guarantee of identity, quality, workmanship, solvency, or suitability. Users should make their own checks and promptly report suspicious or unsafe conduct."],
  ["7. Reviews, content, and intellectual property", "Users must post honest, lawful content they have the right to share. Trade Seekerz may moderate or remove content and may use submitted marketplace content to operate and promote the service, subject to applicable law."],
  ["8. Disputes and liability", "Users should first try to resolve project disputes with each other. Trade Seekerz may assist with marketplace issues but is not the contractor, employer, principal, or guarantor of the work. Liability is limited to the extent permitted by New Zealand law."],
  ["9. Suspension and termination", "Trade Seekerz may restrict or close accounts for breaches, safety concerns, misuse, non-payment, or legal risk. Users may close their account subject to outstanding obligations and applicable membership terms."],
  ["10. Governing law", "The marketplace terms are governed by New Zealand law. Mandatory rights under the Consumer Guarantees Act 1993, Fair Trading Act 1986, Privacy Act 2020, and other applicable legislation continue to apply where they cannot lawfully be excluded."],
];

export default function TermsPage() {
  return <PageShell>
    <section className="bg-[#071329] py-20 text-white"><div className="container-shell max-w-4xl"><p className="eyebrow text-[#72aaf8]">Marketplace terms</p><h1 className="section-title mt-3">The rules that keep the marketplace clear.</h1><p className="mt-5 max-w-2xl leading-8 text-[#a9b6cc]">Plain-language overview · Last updated 1 October 2024</p></div></section>
    <section className="container-shell max-w-4xl py-16"><div className="rounded-2xl border border-[#b9d7ff] bg-[#eef5ff] p-5 text-sm leading-6 text-[#24466f]">This page is a readable overview. The signed-off Marketplace Terms and Conditions PDF is the authoritative version. <Link className="font-black text-[#0b68ed] underline" href="/trade-seekerz-marketplace-terms.pdf" target="_blank">Open the full terms <ExternalLink className="inline" size={14}/></Link></div><div className="mt-10 grid gap-5">{sections.map(([title, body]) => <article key={title} className="card p-6 sm:p-8"><h2 className="text-xl font-black">{title}</h2><p className="body-copy mt-3">{body}</p></article>)}</div><Link href="/trade-seekerz-marketplace-terms.pdf" download className="btn-primary mt-8"><Download size={17}/> Download full terms</Link></section>
  </PageShell>;
}

