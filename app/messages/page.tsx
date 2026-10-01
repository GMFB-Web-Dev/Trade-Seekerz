import Link from "next/link";
import { MessagesClient } from "./messages-client";
export default function MessagesPage(){return <main className="min-h-screen bg-[#f4f7fb] p-4 sm:p-6"><div className="mx-auto mb-4 flex max-w-[1280px] items-center justify-between"><Link href="/dashboard?demo=homeowner" className="text-sm font-extrabold text-[#0b68ed]">← Dashboard</Link><span className="text-xs font-bold text-[#71809a]">Messages are visible only to project participants</span></div><MessagesClient/></main>}

