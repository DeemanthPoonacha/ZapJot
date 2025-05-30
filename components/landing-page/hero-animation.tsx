import React from "react";
import Image from "next/image";

const ZapJotAnimation: React.FC = () => {
  return (
    <div className="relative w-[800px] h-[600px] max-w-full max-h-[80vh] flex justify-center items-center perspective-3d overflow-hidden group">
      <div className="absolute rounded-[74px] flex justify-center items-center shadow-[0_20px_40px_rgba(138,43,226,0.3)] animate-centerFloat cursor-pointer hover:scale-110 transition-transform duration-300">
        <Image src="/logo.webp" width={402} height={402} alt="zapjot" />
        <div className="absolute inset-0 overflow-hidden rounded-[74px] pointer-events-none">
          <div className="absolute w-[150%] h-[150%] bg-gradient-to-r from-white/20 to-transparent rotate-45 -translate-x-[150%] -translate-y-[150%] group-hover:translate-x-[150%] group-hover:translate-y-[150%] transition-transform duration-2700 ease-out" />
        </div>
      </div>

      <Image
        src="/icons/heart.png"
        width={150}
        height={150}
        alt="heart"
        className="absolute top-8 left-12 hover:scale-110 transition-transform animate-floatTopLeft"
      />

      <Image
        src="/icons/alarm-clock.png"
        width={40}
        height={40}
        alt="alarm-clock"
        className="absolute top-6 right-46 hover:scale-110 transition-transform animate-floatTopRight"
      />

      <Image
        src="/icons/calendar.png"
        width={120}
        height={120}
        alt="calendar"
        className="absolute bottom-12 left-16 hover:scale-110 transition-transform animate-floatBottomLeft"
      />

      <Image
        src="/icons/checklist.png"
        width={100}
        height={100}
        alt="checklist"
        className="absolute bottom-84 right-28 hover:scale-110 transition-transform animate-floatBottomLeft"
      />

      <Image
        src="/icons/diary.png"
        width={70}
        height={70}
        alt="diary"
        className="absolute bottom-18 right-20 hover:scale-110 transition-transform animate-floatBottomRight"
      />

      {/* Ambient Particles */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="absolute w-[4px] h-[4px] rounded-full bg-[radial-gradient(circle,rgba(138,43,226,0.6),transparent)] animate-particleFloat"
          style={{ left: `${10 + i * 10}%`, animationDelay: `${i * 2}s` }}
        />
      ))}
      {/* Floating Photo Cluster (Bottom Center-ish) */}

      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-16 h-16 group card-cluster animate-floatCluster transition-transform hover:scale-120">
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
              className={`photo-card card-${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZapJotAnimation;
