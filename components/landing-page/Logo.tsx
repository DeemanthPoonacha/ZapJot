import { Link } from "@/components/layout/link/CustomLink";
import Image from "next/image";

export const Logo = () => (
  <Link href="/#" className="flex items-center gap-2">
    <Image
      src="/logo.webp"
      width={46.7}
      height={48.7}
      alt=""
      className="shadow-md rounded-[18%]"
    />
    <span className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
      ZapJot
    </span>
  </Link>
);
