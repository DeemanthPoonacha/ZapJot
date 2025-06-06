import React from "react";
import Image from "next/image";

const ZapJotAnimation: React.FC = () => {
  return (
    <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
      <div className="relative w-full h-full flex justify-center items-center overflow- group">
        {/* Main logo container - scales with parent width */}
        <div className="relative w-[70%] rounded-[20%] flex justify-center items-center shadow-[0_2vw_4vw_rgba(138,43,226,0.3)] animate-centerFloat cursor-pointer hover:scale-110 transition-transform duration-300">
          <Image
            src="/logo.webp"
            width={467}
            height={487}
            alt="zapjot"
            className="w-full h-full object-contain"
            priority
            loading="eager"
          />
          <div className="absolute inset-0 overflow-hidden rounded-[8%] pointer-events-none">
            <div className="absolute w-[150%] h-[150%] bg-gradient-to-r from-white/20 to-transparent rotate-45 -translate-x-[150%] -translate-y-[150%] group-hover:translate-x-[150%] group-hover:translate-y-[150%] transition-transform duration-2700 ease-out" />
          </div>
        </div>

        {/* Floating icons - anchored to center with wrapper divs for positioning */}
        <div
          className="absolute top-1/2 left-1/2"
          style={{ transform: "translate(-50%, -50%) translate(-250%, -275%)" }}
        >
          <Image
            src="/icons/heart.png"
            width={100}
            height={100}
            alt="heart"
            className="hover:scale-110 transition-transform animate-floatTopLeft object-contain"
            style={{
              width: "13vw",
              height: "13vw",
              maxWidth: "100px",
              maxHeight: "100px",
            }}
          />
        </div>

        <div
          className="absolute top-1/2 left-1/2"
          style={{ transform: "translate(-50%, -50%) translate(520%, -500%)" }}
        >
          <Image
            src="/icons/alarm-clock.png"
            width={40}
            height={40}
            alt="alarm-clock"
            className="hover:scale-110 transition-transform animate-floatTopRight object-contain"
            style={{
              width: "7vw",
              height: "7vw",
              maxWidth: "50px",
              maxHeight: "50px",
            }}
          />
        </div>

        <div
          className="absolute top-1/2 left-1/2"
          style={{ transform: "translate(-50%, -50%) translate(-170%, 160%)" }}
        >
          <Image
            src="/icons/calendar.png"
            width={140}
            height={140}
            alt="calendar"
            className="hover:scale-110 transition-transform animate-floatBottomLeft object-contain"
            style={{
              width: "16vw",
              height: "16vw",
              maxWidth: "140px",
              maxHeight: "140px",
            }}
          />
        </div>

        <div
          className="absolute top-1/2 left-1/2"
          style={{ transform: "translate(-50%, -50%) translate(230%, -50%)" }}
        >
          <Image
            src="/icons/checklist.png"
            width={100}
            height={100}
            alt="checklist"
            className="hover:scale-110 transition-transform animate-floatBottomLeft object-contain"
            style={{
              width: "12vw",
              height: "12vw",
              maxWidth: "100px",
              maxHeight: "100px",
            }}
          />
        </div>

        <div
          className="absolute top-1/2 left-1/2"
          style={{ transform: "translate(-50%, -50%) translate(400%, 320%)" }}
        >
          <Image
            src="/icons/diary.png"
            width={70}
            height={70}
            alt="diary"
            className="hover:scale-110 transition-transform animate-floatBottomRight object-contain"
            style={{
              width: "10vw",
              height: "10vw",
              maxWidth: "70px",
              maxHeight: "70px",
            }}
          />
        </div>

        {/* Ambient Particles - scaled to container */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[radial-gradient(circle,rgba(138,43,226,0.6),transparent)] animate-particleFloat"
            style={{
              width: "0.5%",
              height: "0.5%",
              left: `${10 + i * 10}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}

        {/* Floating Photo Cluster - anchored to center with wrapper */}
        <div
          className="absolute top-1/2 left-1/2"
          style={{ transform: "translate(-50%, -50%) translate(0%, 320%)" }}
        >
          <div
            className="group card-cluster animate-floatCluster transition-transform hover:scale-120"
            style={{
              width: "8vw",
              height: "8vw",
              maxWidth: "64px",
              maxHeight: "64px",
            }}
          >
            <div className="relative w-full h-full">
              {[
                { src: "/icons/photo-4.png" },
                { src: "/icons/photo-3.png" },
                { src: "/icons/photo-2.png" },
                { src: "/icons/photo-1.png" },
              ].map(({ src }, i) => (
                <Image
                  key={src}
                  src={src}
                  width={60}
                  height={60}
                  alt={`photo${i + 1}`}
                  className={`photo-card card-${
                    i + 1
                  } w-full h-full object-contain`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZapJotAnimation;
