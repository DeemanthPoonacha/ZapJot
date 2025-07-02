import { Link } from "@/components/layout/link/CustomLink";
import ThemedCanvasImage from "@/components/layout/themed-image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center font-semibold gap-2", className)}
    >
      <ThemedCanvasImage
        src="/greyed_out_logo_md.svg"
        width={46.7}
        height={48.7}
        alt="logo"
        className={"shadow-md rounded-[18%]"}
      />
      <span
        className="text-4xl font-extrabold text-primary"
        // className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] via-primary/30 to-[var(--primary)] drop-shadow-[0_1px_1px_var(--foreground)] tracking-tight"
      >
        ZapJot
      </span>
    </Link>
  );
}
