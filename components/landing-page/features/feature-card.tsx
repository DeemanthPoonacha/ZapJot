import { JSX } from "react";
import clsx from "clsx";

type Feature = {
  icon: JSX.Element;
  title: string;
  desc: string;
  gradient: string;
  bgGradient: string;
  shadow: string;
};

const PARTICLE_POSITIONS = [
  { left: "25%", top: "30%" },
  { left: "75%", top: "20%" },
  { left: "45%", top: "80%" },
  { left: "85%", top: "65%" },
  { left: "15%", top: "70%" },
  { left: "60%", top: "40%" },
];

export function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-8 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer",
        feature.shadow,
        "hover:shadow-xl",
      )}
    >
      {/* Hover background gradient */}
      <div
        className={clsx(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-500 opacity-0 group-hover:opacity-10 pointer-events-none",
          feature.gradient,
        )}
      />

      <div className="relative z-10">
        <div
          className={clsx(
            "inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white shadow-md transform transition-all duration-300 group-hover:scale-105",
            `bg-gradient-to-br ${feature.gradient}`,
          )}
        >
          {feature.icon}
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {feature.title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {feature.desc}
        </p>
      </div>

      {/* Decorative deterministic particles */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        {PARTICLE_POSITIONS.map((pos, i) => (
          <div
            key={i}
            className={clsx(
              `absolute w-1 h-1 bg-gradient-to-r ${feature.gradient} rounded-full animate-ping`,
            )}
            style={{
              left: pos.left,
              top: pos.top,
              animationDelay: `${i * 300}ms`,
              animationDuration: "2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
