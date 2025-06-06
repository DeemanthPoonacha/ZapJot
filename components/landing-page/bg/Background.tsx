import "./bg.css";

export const Background = () => (
  <div className="fixed inset-0 overflow-hidden -z-10">
    {/* Gradient mesh background */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30" />

    {/* Animated grid pattern */}
    {/* <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        animation: "gridFloat 25s ease-in-out infinite",
      }}
    /> */}

    {/* Primary floating orbs with dynamic movement */}
    <div className="absolute inset-0">
      {/* Large primary orbs */}
      <div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)",
          top: "10%",
          left: "10%",
          animation:
            "orbFloat1 20s ease-in-out infinite, pulseGlow 8s ease-in-out infinite",
        }}
      />

      <div
        className="absolute w-80 h-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(236, 72, 153, 0.1) 40%, transparent 70%)",
          top: "20%",
          right: "15%",
          filter: "blur(35px)",
          animation:
            "orbFloat2 25s ease-in-out infinite, pulseGlow 6s ease-in-out infinite 2s",
        }}
      />

      <div
        className="absolute w-72 h-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)",
          bottom: "25%",
          left: "25%",
          filter: "blur(30px)",
          animation:
            "orbFloat3 18s ease-in-out infinite, pulseGlow 10s ease-in-out infinite 4s",
        }}
      />

      {/* Medium secondary orbs */}
      <div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 80%)",
          top: "60%",
          right: "30%",
          filter: "blur(25px)",
          animation:
            "orbFloat4 22s ease-in-out infinite, pulseGlow 7s ease-in-out infinite 1s",
        }}
      />

      <div
        className="absolute w-56 h-56 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(14, 165, 233, 0.1) 50%, transparent 80%)",
          bottom: "10%",
          right: "10%",
          filter: "blur(20px)",
          animation:
            "orbFloat5 16s ease-in-out infinite, pulseGlow 9s ease-in-out infinite 3s",
        }}
      />

      {/* Small accent orbs with more dynamic movement */}
      <div
        className="absolute w-32 h-32 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, transparent 70%)",
          top: "40%",
          left: "60%",
          filter: "blur(15px)",
          animation:
            "orbFloat6 12s ease-in-out infinite, pulseGlow 4s ease-in-out infinite",
        }}
      />

      <div
        className="absolute w-40 h-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)",
          top: "15%",
          left: "70%",
          filter: "blur(18px)",
          animation:
            "orbFloat7 14s ease-in-out infinite, pulseGlow 5s ease-in-out infinite 1s",
        }}
      />
    </div>
    {/* Enhanced floating particles */}
    {/* <div className="absolute inset-0 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-purple-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particle ${15 + Math.random() * 10}s linear infinite ${
              i * 1.5
            }s`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div> */}

    {/* Subtle noise texture overlay */}
    <div
      className="absolute inset-0 opacity-5 mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  </div>
);
