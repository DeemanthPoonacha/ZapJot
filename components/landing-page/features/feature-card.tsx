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

export function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-8 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer",
        feature.shadow,
        "hover:shadow-xl"
      )}
    >
      {/* Hover gradient bg */}
      <div
        className={clsx(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-500 opacity-0 group-hover:opacity-50",
          feature.bgGradient
        )}
      />
      <div
        className={clsx(
          "absolute inset-0 bg-gradient-to-r transition-opacity duration-500 opacity-0 group-hover:opacity-100 -z-10",
          feature.gradient
        )}
      />
      <div className="absolute inset-[1px] bg-white rounded-3xl -z-10" />

      <div className="relative z-10">
        <div
          className={clsx(
            "inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
            `bg-gradient-to-br ${feature.gradient}`
          )}
        >
          {feature.icon}
        </div>
        <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
          {feature.title}
        </h3>
        <p className="mt-3 text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
          {feature.desc}
        </p>
      </div>

      {
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={clsx(
                `absolute w-1 h-1 bg-gradient-to-r ${feature.gradient} rounded-full animate-ping`
              )}
              style={{
                left: `${20 + Math.random() * 80}%`,
                top: `${20 + Math.random() * 80}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>
      }
    </div>
  );
}
