import Image from "next/image";

export function ImageFrame({
  data: { id, title, description, imageUrl = "/screenshots/chapters.png" },
  onClick,
}: // isSelected,
{
  data: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
  };
  onClick: () => void;
  isSelected?: boolean;
}) {
  return (
    <div
      key={id}
      onClick={onClick}
      className="relative mx-auto cursor-pointer group"
    >
      <div className="text-primary font-semibold text-center">{title}</div>
      <div className="relative rounded-2xl bg-gradient-to-b from-primary/20 to-primary/5 p-2 shadow-xl">
        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary/30 blur-2xl" />
        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary/30 blur-2xl" />
        <Image
          src={imageUrl}
          width={400}
          height={600}
          alt="ZapJot App Preview"
          className="rounded-xl shadow-sm mx-auto"
          priority
        />
      </div>
      <p className="w-full absolute p-2 text- mt-2 line-clamp-2 text-muted-foreground text-center !z-20">
        {description}
      </p>
      {/* {isSelected && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent transition-opacity duration-300 rounded-xl" />
          <p className="absolute bottom-0 p-2 text-sm mt-2 line-clamp-2 text-white !z-20">
            {description}
          </p>
        </>
      )} */}
      {/* <div
        className={cn(
          "absolute inset-0 !bg-black/30 bg-opacity-60 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 rounded-2xl",
          "hover:opacity-100 transition-opacity"
        )}
      >
        <span className="relative">
          <div className="absolute -inset-0.5 rounded-lg gradient-bg opacity-75 blur-2xl" />
          <h3 className="absolute top-0 text-2xl font-bold text-zinc-50 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            {title}
          </h3>
        </span>
        <div className="absolute z-20 bottom-0 text-white text-center text-sm">
          {description}
        </div>
      </div> */}
    </div>
  );
}
