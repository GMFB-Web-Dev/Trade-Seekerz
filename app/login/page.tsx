import Image from "next/image";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  return <main className="grid min-h-screen lg:grid-cols-2"><section className="flex flex-col p-6 sm:p-10"><Logo/><div className="m-auto w-full py-12"><AuthForm mode="login"/></div><Link href="/" className="text-sm font-bold text-[#0b68ed]">← Back home</Link></section><section className="relative hidden overflow-hidden bg-[#071329] lg:block"><Image src="/images/how-it-works-tradies-cover.png" alt="Tradesperson on site" fill className="object-cover opacity-75"/><div className="absolute inset-0 bg-gradient-to-t from-[#071329] via-transparent to-transparent"/><div className="absolute inset-x-12 bottom-14 text-white"><p className="text-4xl font-black tracking-[-.04em]">Good work starts with a clear brief.</p><p className="mt-4 max-w-lg leading-7 text-white/70">Pick up where you left off—your projects, applicants, quotes and conversations are waiting.</p></div></section></main>;
}

