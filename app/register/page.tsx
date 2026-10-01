import Image from "next/image";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/logo";

export default function RegisterPage() {
  return <main className="grid min-h-screen lg:grid-cols-2"><section className="flex flex-col p-6 sm:p-10"><Logo/><div className="m-auto w-full py-12"><AuthForm mode="register"/></div><Link href="/" className="text-sm font-bold text-[#0b68ed]">← Back home</Link></section><section className="relative hidden overflow-hidden bg-[#0b68ed] lg:block"><Image src="/images/hero-tradie.png" alt="Local tradesperson" fill className="object-cover opacity-70"/><div className="absolute inset-0 bg-gradient-to-t from-[#071329] via-[#071329]/10 to-transparent"/><div className="absolute inset-x-12 bottom-14 text-white"><p className="text-4xl font-black tracking-[-.04em]">One account. The whole job.</p><p className="mt-4 max-w-lg leading-7 text-white/75">From posting and quoting to messages and reviews, the details stay together.</p></div></section></main>;
}

