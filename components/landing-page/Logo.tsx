import { Link } from "@/components/layout/link/CustomLink";
import Image from "next/image";

export const Logo = () => (
  <Link href="/#" className="flex items-center gap-2">
    <Image src="/logo.webp" width={42} height={42} alt="" />
    <span className="text-xl font-bold text-slate-800">ZapJot</span>
  </Link>
);
