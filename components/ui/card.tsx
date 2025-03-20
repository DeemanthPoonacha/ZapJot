import * as React from "react";

import { cn, formatDateTitle } from "@/lib/utils";
import Image from "next/image";
import { Calendar1, MapPin } from "lucide-react";
import { CldImage } from "next-cloudinary";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-6 pt-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6", className)}
      {...props}
    />
  );
}

function ListCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-6 pb-6",
        "bg-muted/30 px-4 py-2 text-xs text-muted-foreground flex justify-between items-center",
        className
      )}
      {...props}
    />
  );
}

function ListCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-2 rounded-xl border shadow-sm",
        "h-full overflow-hidden hover:shadow-md transition-all border-l-4 border-l-primary/20 hover:border-l-primary",
        className
      )}
      {...props}
    />
  );
}

function GridCardWithOverlay({
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
        className
      )}
    >
      {image && (
        <CldImage
          width={400}
          height={200}
          src={image}
          alt={title}
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300" />

      {/* Text content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end z-10">
        <h3 className="text-lg font-semibold text-white drop-shadow-md truncate">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-white/80 drop-shadow-md">{subtitle}</p>
        )}
        <div className="flex justify-between">
          <p className="text-xs text-white/60 mt-1 flex gap-1 items-center">
            <Calendar1 size={16} /> {formatDateTitle(date)}
          </p>
          {location && (
            <p className="text-xs text-white/60 mt-1 flex gap-1 items-center">
              <MapPin size={16} /> {location}
            </p>
          )}
        </div>
      </div>

      {/* Extra content */}
      <div className="absolute right-0 p-4 z-10">{extra}</div>
    </Card>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  ListCard,
  ListCardFooter,
  GridCardWithOverlay,
};
