import { formatDateTitle } from "@/lib/utils/date-time";
import { Calendar1, MapPin } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { Card } from "./card";
import { cn } from "@/lib/utils";

export function GridCardWithOverlay({
  className,
  date,
  image,
  title,
  subtitle,
  extra,
  location,
  ...props
}: React.ComponentProps<"div"> & {
  image?: string;
  title: string;
  subtitle?: string;
  date?: string;
  location?: string;
  extra?: React.ReactNode;
}) {
  return (
    <Card
      {...props}
      className={cn(
        "group relative h-32 overflow-hidden rounded-2xl shadow-lg",
        "transition-all hover:border-l-4 hover:border-l-primary",
        className
      )}
    >
      {image && (
        <CldImage
          gravity="auto"
          // crop="auto"
          sizes="100vw"
          // aspectRatio="16:9"
          crop="fill"
          fill={true}
          src={image}
          alt={title}
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300" />

      {/* Text content */}
      <div className="absolute inset-0 p-4 pb-3 flex flex-col justify-end z-10">
        <h3 className="text-lg font-semibold text-white drop-shadow-md truncate">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-white/80 drop-shadow-md">{subtitle}</p>
        )}
        <div className="flex justify-between">
          <p className="text-xs text-white/60 mt-1 flex gap-1 items-center">
            <Calendar1 size={16} className="mb-1" /> {formatDateTitle(date)}
          </p>
          {location && (
            <p className="text-xs text-white/60 mt-1 flex gap-1 items-center">
              <MapPin size={16} className="mb-1/2" /> {location}
            </p>
          )}
        </div>
      </div>

      {/* Extra content */}
      <div className="absolute right-0 p-4 z-10">{extra}</div>
    </Card>
  );
}
