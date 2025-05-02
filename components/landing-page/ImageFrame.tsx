import Image from "next/image";

export function ImageFrame({
  imageSrc = "/screenshots/chapters.png",
}: {
  imageSrc?: string;
}) {
  return (
    <div className="relative mx-auto">
      <div className="relative rounded-2xl bg-gradient-to-b from-primary/20 to-primary/5 p-2 shadow-xl">
        <Image
          src={imageSrc}
          width={400}
          height={600}
          alt="ZapJot App Preview"
          className="rounded-xl shadow-sm"
          priority
        />
      </div>
      <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary/30 blur-2xl" />
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary/30 blur-2xl" />
    </div>
  );
}
