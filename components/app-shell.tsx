"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bell, BriefcaseBusiness, CircleUserRound, CreditCard, LayoutDashboard, LogOut, Menu, MessageSquare, Search, Settings, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";

type Role = "homeowner" | "tradesperson" | "admin";
const navByRole: Record<Role, {label:string; href:string; icon:React.ComponentType<{size?:number}>}[]> = {
  homeowner: [
    { label:"Overview", href:"/dashboard", icon:LayoutDashboard }, { label:"My projects", href:"/dashboard#projects", icon:BriefcaseBusiness }, { label:"Messages", href:"/messages", icon:MessageSquare }, { label:"Account", href:"/settings", icon:Settings },
  ],
  tradesperson: [
    { label:"Overview", href:"/dashboard", icon:LayoutDashboard }, { label:"Find work", href:"/jobs", icon:Search }, { label:"My leads", href:"/dashboard#leads", icon:BriefcaseBusiness }, { label:"Messages", href:"/messages", icon:MessageSquare }, { label:"Billing", href:"/pricing", icon:CreditCard }, { label:"Profile", href:"/settings", icon:CircleUserRound },
  ],
  admin: [
    { label:"Overview", href:"/admin", icon:LayoutDashboard }, { label:"Moderation", href:"/admin?tab=moderation", icon:ShieldCheck }, { label:"Users", href:"/admin?tab=users", icon:CircleUserRound }, { label:"Projects", href:"/admin?tab=projects", icon:BriefcaseBusiness }, { label:"Billing", href:"/admin?tab=billing", icon:CreditCard },
  ],
};

export function AppShell({ role, name, children }: { role:Role; name:string; children:React.ReactNode }) {
  const pathname = usePathname(); const searchParams = useSearchParams(); const router = useRouter(); const [mobile, setMobile] = useState(false);
  async function logOut() { try { await createClient().auth.signOut(); } catch {} router.push("/"); router.refresh(); }
  return (
    <div className="min-h-screen bg-[#f4f7fb] lg:grid lg:grid-cols-[250px_1fr]">
      <aside className={`${mobile ? "fixed inset-0 z-50 flex" : "hidden"} flex-col bg-[#071329] p-5 text-white lg:sticky lg:top-0 lg:flex lg:h-screen`}>
        <div className="flex items-center justify-between"><Logo light/><button onClick={() => setMobile(false)} className="lg:hidden"><X/></button></div>
        <div className="mt-10 text-[10px] font-black uppercase tracking-[.18em] text-[#71809b]">{role === "admin" ? "Admin console" : "Your workspace"}</div>
        <nav className="mt-4 grid gap-1">{navByRole[role].map((item) => { const Icon=item.icon; const tab=searchParams.get("tab") ?? "overview"; const preview=searchParams.get("demo"); const active=role==="admin"?pathname==="/admin"&&item.label.toLowerCase()===tab:pathname===item.href&&!item.href.includes("#");let href=item.href;if(role==="admin"&&preview==="1")href+=`${href.includes("?")?"&":"?"}demo=1`;if(role!=="admin"&&preview&&href.startsWith("/dashboard")){const[base,hash]=href.split("#");href=`${base}?demo=${role}${hash?`#${hash}`:""}`}; return <Link onClick={()=>setMobile(false)} key={item.label} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${active ? "bg-[#0b68ed] text-white" : "text-[#9dadc6] hover:bg-white/5 hover:text-white"}`}><Icon size={18}/>{item.label}</Link>; })}</nav>
        <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-4"><div className="text-sm font-extrabold">{name}</div><div className="mt-1 text-xs capitalize text-[#8e9db6]">{role}</div><button onClick={logOut} className="mt-4 flex items-center gap-2 text-xs font-bold text-[#aab6c9] hover:text-white"><LogOut size={15}/>Log out</button></div>
      </aside>
      <div className="min-w-0"><header className="flex h-[72px] items-center justify-between border-b border-[#dfe6f0] bg-white px-5 sm:px-8"><button className="rounded-lg border border-[#dce4ef] p-2 lg:hidden" onClick={()=>setMobile(true)}><Menu/></button><div className="hidden text-sm font-semibold text-[#62708a] sm:block">Trade Seekerz / <span className="text-[#0b1833]">{role === "admin" ? "Operations" : "Dashboard"}</span></div><div className="flex items-center gap-3"><button aria-label="Notifications" className="relative rounded-full border border-[#dce4ef] p-2.5"><Bell size={18}/><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ff4d4f]"/></button><div className="grid h-10 w-10 place-items-center rounded-full bg-[#eaf3ff] font-black text-[#0b68ed]">{name[0]?.toUpperCase()}</div></div></header><main className="p-5 sm:p-8">{children}</main></div>
    </div>
  );
}
