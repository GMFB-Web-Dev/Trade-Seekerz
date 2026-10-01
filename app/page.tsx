import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin, Search, ShieldCheck, Star, UserRoundPlus, FilePlus2, MessagesSquare } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { categories, testimonials } from "@/lib/mock-data";

export default function Home() {
  return (
    <PageShell>
      <section className="relative overflow-hidden bg-[#f4f8ff]">
        <div className="absolute inset-y-0 right-0 hidden w-[50%] lg:block"><Image src="/images/hero-tradie.png" alt="Tradesperson carrying tools" fill priority className="object-cover object-center" /><div className="absolute inset-0 bg-gradient-to-r from-[#f4f8ff] via-[#f4f8ff]/25 to-transparent" /></div>
        <div className="container-shell relative grid min-h-[690px] items-center py-20 lg:grid-cols-2">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_8px_30px_rgba(28,62,110,.1)]"><span className="grid h-9 w-9 place-items-center rounded-full bg-white text-xl font-bold text-[#4285f4] shadow">G</span><div className="text-xs"><div className="font-extrabold text-[#233451]">Google Rating</div><div className="flex items-center gap-1 font-bold text-[#ffae00]">5.0 <Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/></div></div></div>
            <p className="eyebrow">New Zealand&apos;s local job marketplace</p>
            <h1 className="display mt-4 max-w-[760px]">Find the right tradie. <span className="text-[#0b68ed]">Fast and easy.</span></h1>
            <p className="body-copy mt-6 max-w-xl text-lg">Tell us what you need, compare genuine quotes, and choose with confidence. Posting a job is free.</p>
            <form action="/jobs" className="mt-8 grid gap-3 rounded-2xl bg-white p-3 shadow-[0_18px_55px_rgba(14,56,112,.15)] sm:grid-cols-[1.25fr_1fr_auto]">
              <label className="flex items-center gap-2 rounded-xl border border-[#dce4ef] px-4"><Search size={18} className="text-[#0b68ed]"/><input name="q" aria-label="Trade or service" placeholder="e.g. Landscaping" className="h-12 min-w-0 flex-1 outline-none"/></label>
              <label className="flex items-center gap-2 rounded-xl border border-[#dce4ef] px-4"><MapPin size={18} className="text-[#0b68ed]"/><input name="location" aria-label="Location" placeholder="Postcode or city" className="h-12 min-w-0 flex-1 outline-none"/></label>
              <button className="btn-primary min-h-12 px-7">Search <ArrowRight size={17}/></button>
            </form>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-[#4b5d79]"><span className="flex gap-2"><Check size={18} className="text-[#16a56b]"/>Free to post</span><span className="flex gap-2"><Check size={18} className="text-[#16a56b]"/>Verified profiles</span><span className="flex gap-2"><Check size={18} className="text-[#16a56b]"/>You choose who to hire</span></div>
          </div>
        </div>
      </section>

      <section className="container-shell py-24">
        <div className="grid gap-6 md:grid-cols-3">
          <Step number="01" icon={<UserRoundPlus/>} title="Create your account" body="A few quick details and you’re ready. Homeowners post free; tradespeople set up a business profile." />
          <Step number="02" icon={<FilePlus2/>} title="Post your project" body="Add the job, location, budget, timeframe, and photos so tradespeople can quote accurately." />
          <Step number="03" icon={<MessagesSquare/>} title="Choose your best offer" body="Compare profiles and quotes, chat securely, then choose the tradesperson who fits." />
        </div>
      </section>

      <section className="bg-[#071329] py-24 text-white">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-[1fr_1.08fr]">
          <div><p className="eyebrow text-[#72aaf8]">Clear choices, without the runaround</p><h2 className="section-title mt-4">Good projects deserve good people.</h2><p className="mt-6 max-w-xl leading-7 text-[#a9b6cc]">Trade Seekerz keeps the important details in one place—from the first project brief to the accepted quote and final review.</p><div className="mt-8 grid gap-4"><Benefit title="Real project detail" body="Budget, stage, timeframe, photos and location upfront."/><Benefit title="Quote with context" body="Tradespeople spend credits only when a lead genuinely fits."/><Benefit title="A safer decision" body="See business profiles, verification, services and customer feedback."/></div><Link href="/how-it-works" className="btn-yellow mt-9">See how it works <ArrowRight size={17}/></Link></div>
          <div className="relative min-h-[500px] overflow-hidden rounded-[2rem] bg-[#0b68ed]"><Image src="/images/how-it-works-homeowner-cover.png" alt="Homeowner planning a project" fill className="object-cover"/><div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white p-5 text-[#0b1833] shadow-2xl sm:inset-x-auto sm:right-5 sm:w-[320px]"><div className="flex items-center justify-between"><span className="text-sm font-extrabold">Project ready to quote</span><span className="status-pill bg-[#e7f8f0] text-[#107b52]">Open</span></div><h3 className="mt-4 text-xl font-black">Kitchen splashback & lighting</h3><p className="mt-2 text-sm text-[#62708a]">Mount Eden · Electrical · 4 responses</p></div></div>
        </div>
      </section>

      <section className="container-shell py-24">
        <div className="mx-auto max-w-3xl text-center"><p className="eyebrow">Trusted locally</p><h2 className="section-title mt-3">Home projects feel easier with the right help.</h2></div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">{testimonials.map((t) => <article key={t.name} className="card p-7"><div className="flex gap-1 text-[#ffc11a]">{[1,2,3,4,5].map(n=><Star key={n} size={18} fill="currentColor"/>)}</div><p className="mt-6 text-[1.04rem] leading-7 text-[#35445f]">“{t.quote}”</p><div className="mt-6 flex items-center gap-3 border-t border-[#e2e9f2] pt-5"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#eaf3ff] font-black text-[#0b68ed]">{t.name[0]}</div><div><div className="font-extrabold">{t.name}</div><div className="text-xs text-[#73809a]">{t.trade}</div></div></div></article>)}</div>
      </section>

      <section className="bg-[#f5f8fc] py-24">
        <div className="container-shell"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Popular near you</p><h2 className="section-title mt-3">What type of job needs doing?</h2></div><Link href="/jobs" className="font-extrabold text-[#0b68ed]">Browse all projects →</Link></div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{categories.map((category) => <Link href={`/jobs?category=${category.slug}`} key={category.slug} className="blue-corner group overflow-hidden rounded-2xl border border-[#dce4ef] bg-white transition hover:-translate-y-1 hover:shadow-xl"><div className="relative h-44 overflow-hidden"><Image src={category.image} alt={category.name} fill className="object-cover transition duration-500 group-hover:scale-105"/></div><div className="flex items-center justify-between p-5"><div><h3 className="text-lg font-black text-[#0b55bd] underline decoration-1 underline-offset-4">{category.name}</h3><p className="mt-1 text-xs text-[#73809a]">{category.count} local specialists</p></div></div></Link>)}</div>
        </div>
      </section>

      <section className="container-shell py-24"><div className="grid gap-12 lg:grid-cols-[1fr_.85fr]"><div><p className="eyebrow">Frequently asked questions</p><h2 className="section-title mt-3">A few things people ask first.</h2><div className="mt-8 grid gap-3">{faqs.map(([q,a])=><details key={q} className="group rounded-xl border border-[#dce4ef] p-5"><summary className="cursor-pointer list-none pr-8 font-extrabold">{q}<span className="float-right text-xl text-[#0b68ed] group-open:rotate-45">+</span></summary><p className="mt-3 max-w-2xl text-sm leading-6 text-[#62708a]">{a}</p></details>)}</div></div><div className="rounded-[2rem] bg-[#0b68ed] p-10 text-white"><ShieldCheck size={48}/><h3 className="mt-8 text-3xl font-black tracking-tight">Have more questions?</h3><p className="mt-4 leading-7 text-[#d5e5fb]">Our support team can help with posting a job, using credits, account settings, or reporting a concern.</p><Link href="/contact" className="btn-yellow mt-8 w-full">Talk to support <ArrowRight size={17}/></Link></div></div></section>

      <section className="bg-[#ffc11a] py-16"><div className="container-shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div><p className="text-sm font-black uppercase tracking-[.14em]">Ready when you are</p><h2 className="mt-2 text-4xl font-black tracking-[-.04em]">Get your next project moving.</h2></div><div className="flex flex-wrap gap-3"><Link href="/projects/new" className="btn-dark">Post a job free</Link><Link href="/pricing" className="btn-outline border-black/20 bg-white/50">I’m a tradesperson</Link></div></div></section>
    </PageShell>
  );
}

function Step({ number, icon, title, body }: { number:string; icon:React.ReactNode; title:string; body:string }) { return <article className="relative rounded-2xl border border-[#dce4ef] p-7"><div className="mb-7 flex items-start justify-between"><div className="grid h-14 w-14 place-items-center rounded-full bg-[#eaf3ff] text-[#0b68ed]">{icon}</div><span className="text-4xl font-black text-[#e2e9f2]">{number}</span></div><h3 className="text-2xl font-black tracking-tight text-[#0b68ed]">{title}</h3><p className="body-copy mt-3">{body}</p></article>; }
function Benefit({ title, body }: {title:string; body:string}) { return <div className="flex gap-3"><span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#1d7af5] text-white"><Check size={14}/></span><div><h3 className="font-extrabold">{title}</h3><p className="mt-1 text-sm leading-6 text-[#a9b6cc]">{body}</p></div></div>; }
const faqs = [["How does Trade Seekerz work?","Homeowners post a detailed project. Registered tradespeople can browse matching work and spend a credit to introduce themselves and quote."],["Is it free to post a job?","Yes. Homeowners can create a project, receive quotes, message applicants, and choose who to hire without a posting fee."],["How do tradespeople pay?","Tradespeople can choose a monthly or annual membership that includes credits, then buy top-up credits if they need more."],["Do you employ the tradespeople?","No. Trade Seekerz provides the marketplace. Homeowners and independent tradespeople agree the scope, price, and delivery of work directly."],["What if something does not look right?","Use the report action on a profile or project, or contact support. Admins can investigate, suspend accounts, and moderate content."]];

