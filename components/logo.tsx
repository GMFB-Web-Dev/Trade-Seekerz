import Image from "next/image";
import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return <Link href="/" aria-label="Trade Seekerz home" className="inline-flex items-center"><Image src={light ? "/brand/logo-white.png" : "/brand/logo.png"} alt="Trade Seekerz" width={122} height={44} className="h-10 w-auto object-contain" priority /></Link>;
}

