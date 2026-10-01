import Link from "next/link";
import { Logo } from "@/components/logo";
import { ProjectForm } from "./project-form";

export default function NewProjectPage(){return <main className="min-h-screen bg-[#f4f7fb]"><header className="border-b border-[#dfe6f0] bg-white"><div className="container-shell flex h-[72px] items-center justify-between"><Logo/><Link href="/dashboard?demo=homeowner" className="text-sm font-extrabold text-[#0b68ed]">Save and exit</Link></div></header><section className="container-shell py-12"><div className="mb-8 max-w-3xl"><p className="eyebrow">Create a project listing</p><h1 className="mt-3 text-4xl font-black tracking-[-.045em] sm:text-5xl">Tell the right tradie what a good job looks like.</h1><p className="mt-4 text-[#62708a]">Most listings take about five minutes. You can update the details later.</p></div><ProjectForm/></section></main>}

