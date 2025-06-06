"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { ImageFrame } from "./ImageFrame";
import { originalSlides } from "../data";
import "./app-preview.css";

export default function Slides() {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  const extendToMinSize = (
    array: {
      id: number;
      title: string;
      description: string;
      imageUrl: string;
    }[],
    minSize = 5
  ) => {
    if (array.length === 0) return [];
    const timesToExtend = Math.ceil(minSize / array.length);
    const extendedArray = Array(timesToExtend).fill(array).flat();
    return extendedArray;
  };

  const projects = extendToMinSize(originalSlides, 5);

  const handleNext = () => {
    const nextIndex = (selectedProjectIndex + 1) % projects.length;
    setSelectedProjectIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex =
      (selectedProjectIndex - 1 + projects.length) % projects.length;
    setSelectedProjectIndex(prevIndex);
  };

  const getVisibleIndices = () => {
    const total = projects.length;
    return [
      (selectedProjectIndex - 2 + total) % total,
      (selectedProjectIndex - 1 + total) % total,
      selectedProjectIndex,
      (selectedProjectIndex + 1) % total,
      (selectedProjectIndex + 2) % total,
    ];
  };

  const getItemStyles = (index: number) => {
    const visibleIndices = getVisibleIndices();
    const position = visibleIndices.indexOf(index);

    const baseStyles: React.CSSProperties = {
      position: "absolute",
      transition: "all 700ms cubic-bezier(0.4, 0, 0.2, 1)",
    };

    switch (position) {
      case 0:
        return {
          ...baseStyles,
          transform: "translateX(-180%) scale(0.5) rotateY(45deg)",
          opacity: 0.3,
          zIndex: 1,
          filter: "blur(2px)",
        };
      case 1:
        return {
          ...baseStyles,
          transform: "translateX(-100%) scale(0.75) rotateY(25deg)",
          opacity: 0.6,
          zIndex: 2,
          filter: "blur(1px)",
        };
      case 2:
        return {
          ...baseStyles,
          transform: "translateX(0%) scale(1) rotateY(0deg)",
          opacity: 1,
          zIndex: 3,
          filter: "blur(0px)",
        };
      case 3:
        return {
          ...baseStyles,
          transform: "translateX(100%) scale(0.75) rotateY(-25deg)",
          opacity: 0.6,
          zIndex: 2,
          filter: "blur(1px)",
        };
      case 4:
        return {
          ...baseStyles,
          transform: "translateX(180%) scale(0.5) rotateY(-45deg)",
          opacity: 0.3,
          zIndex: 1,
          filter: "blur(2px)",
        };
      default:
        return {
          ...baseStyles,
          transform: "translateX(0%) scale(0.3)",
          opacity: 0,
          zIndex: -1,
        };
    }
  };

  return (
    <div className="my-8 relative w-full mx-auto min-h-[70rem] flex items-center justify-center pointer-events-auto overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />

      {/* Enhanced title section */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center z-10">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          <span className="text-2xl font-bold uppercase tracking-wider bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight text-nowrap">
            App Showcase
          </span>
        </div>
        {/* <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto" /> */}
      </div>

      {/* Main carousel container */}
      <div className="absolute top-1/2 -translate-y-1/2 w-screen max-w-7xl h-full overflow-hidden flex justify-center perspective-1000 mt-12">
        {/* Enhanced navigation buttons */}
        <button
          onClick={handlePrev}
          className="md:hidden absolute top-1/2 -translate-y-1/2 left-4 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group"
          aria-label="Previous"
        >
          <ChevronLeft className="text-white w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={handleNext}
          className="md:hidden absolute top-1/2 -translate-y-1/2 right-4 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group"
          aria-label="Next"
        >
          <ChevronRight className="text-white w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* Slides container */}
        <div className="absolute w-full max-w-7xl flex justify-center preserve-3d">
          {projects.map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              style={getItemStyles(index)}
              className="w-5/6 md:w-1/3 pt-40 preserve-3d"
            >
              <ImageFrame
                onClick={() => setSelectedProjectIndex(index)}
                data={project}
                isSelected={selectedProjectIndex === index}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {originalSlides.map((_, index) => (
          <button
            key={index}
            title={`Slide ${index + 1}`}
            onClick={() => setSelectedProjectIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              selectedProjectIndex % originalSlides.length === index
                ? "bg-blue-400 w-8"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
