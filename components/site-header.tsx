"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";

const links = [["Find a tradie", "/jobs"], ["For tradespeople", "/pricing"], ["How it works", "/how-it-works"], ["About", "/about"]];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-[#e2e9f2] bg-white/95 backdrop-blur">
      <div className="container-shell flex h-[72px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">{links.map(([label, href]) => <Link key={href} href={href} className="text-sm font-semibold text-[#33415c] transition hover:text-[#0b68ed]">{label}</Link>)}</nav>
        <div className="hidden items-center gap-2 lg:flex"><Link href="/login" className="btn-outline">Log in</Link><Link href="/projects/new" className="btn-primary">Post a job</Link></div>
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="rounded-lg border border-[#dce4ef] p-2 lg:hidden">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="border-t border-[#e2e9f2] bg-white p-5 lg:hidden"><nav className="container-shell grid gap-3">{links.map(([label, href]) => <Link key={href} onClick={() => setOpen(false)} href={href} className="rounded-lg px-3 py-2 font-semibold hover:bg-[#eaf3ff]">{label}</Link>)}<div className="mt-2 grid grid-cols-2 gap-2"><Link href="/login" className="btn-outline">Log in</Link><Link href="/projects/new" className="btn-primary">Post a job</Link></div></nav></div>}
    </header>
  );
}

