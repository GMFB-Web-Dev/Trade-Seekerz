import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="bg-[#071329] py-16 text-white">
      <div className="container-shell grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div><Logo light /><p className="mt-5 max-w-xs text-sm leading-6 text-[#9caac2]">A better way for New Zealand homeowners and great local tradespeople to find each other.</p></div>
        <FooterGroup title="Homeowners" links={[["Post a job","/projects/new"],["Find a tradie","/jobs"],["How it works","/how-it-works"]]} />
        <FooterGroup title="Tradespeople" links={[["Browse work","/jobs"],["Memberships","/pricing"],["Dashboard","/dashboard?demo=tradesperson"]]} />
        <FooterGroup title="Company" links={[["About","/about"],["Contact","/contact"],["Terms","/terms"],["Privacy","/privacy"],["Admin","/admin?demo=1"]]} />
      </div>
      <div className="container-shell mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-[#7f8ea9] sm:flex-row sm:justify-between"><span>© 2026 Trade Seekerz. All rights reserved.</span><span>Made for Aotearoa New Zealand.</span></div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[][] }) {
  return <div><h3 className="text-sm font-extrabold">{title}</h3><div className="mt-4 grid gap-3">{links.map(([label,href]) => <Link key={href} href={href} className="text-sm text-[#9caac2] hover:text-white">{label}</Link>)}</div></div>;
}
