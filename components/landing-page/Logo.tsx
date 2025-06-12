import { Link } from "@/components/layout/link/CustomLink";
import Image from "next/image";

export const Logo = () => (
  <Link href="/#" className="flex items-center gap-2">
    <Image
      src="/logo.webp"
      width={46.7}
      height={48.7}
      alt=""
      className="shadow-md"
    />
    <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[hsl(272,60%,50%)] via-[hsl(272,60%,50%)]/30 to-[hsl(272,60%,50%)] drop-shadow-[0_1px_1px_hsl(272,40%,16%)] tracking-tight">
      ZapJot
    </span>
  </Link>
);
