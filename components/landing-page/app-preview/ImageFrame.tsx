import Image from "next/image";
import "./app-preview.css"; // Assuming you have some custom styles

export function ImageFrame({
  data: { id, title, description, imageUrl },
  onClick,
  isSelected,
}: {
  data: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
  };
  onClick: () => void;
  isSelected: boolean;
}) {
  return (
    <div
      key={id}
      onClick={onClick}
      className={`relative mx-auto cursor-pointer group transition-all duration-700 ${
        isSelected ? "scale-105" : "hover:scale-102"
      }`}
    >
      {/* Floating title with gradient background */}
      <div className="relative z-10 mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20">
          {isSelected && (
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
          )}
          <span className="font-bold text-lg text-gray-50">{title}</span>
        </div>
      </div>

      {/* Enhanced image container with multiple layers */}
      <div className="relative group">
        {/* Animated gradient background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

        {/* Glass morphism container */}
        <div className="relative rounded-3xl bg-white/10 backdrop-blur-sm p-3 shadow-2xl border border-white/20 overflow-hidden">
          {/* Animated corner highlights */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-blue-400/30 to-transparent rounded-full blur-2xl animate-pulse delay-1000" />

          {/* Image placeholder with gradient */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 aspect-[2/3] shadow-inner">
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

            {/* Mock app interface */}
            {/* <div className="p-6 h-full flex flex-col"> */}
            <Image
              src={imageUrl}
              width={400}
              height={600}
              alt="ZapJot App Preview"
              className="rounded-xl shadow-sm mx-auto"
              loading="lazy"
            />
            {/* </div> */}
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Enhanced description with background */}
      <div className="relative z-10 mt-6 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <p className="text-center text-gray-50 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}
