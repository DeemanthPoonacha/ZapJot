"use client";

import { useSwipeable } from "react-swipeable";
import { CSSProperties, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageFrame } from "./ImageFrame";

export default function Slides() {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const originalSlides = [
    {
      id: 1,
      title: "Home",
      description: "Your personalized dashboard to access everything quickly.",
      imageUrl: "/screenshots/home.png",
    },
    {
      id: 2,
      title: "Chapters",
      description: "Organize journals into themed storylines or moments.",
      imageUrl: "/screenshots/chapters.png",
    },
    {
      id: 3,
      title: "Chapter",
      description: "Dive into a specific chapter with all its memories.",
      imageUrl: "/screenshots/chapter-tokyo.png",
    },
    {
      id: 4,
      title: "Journal",
      description: "Capture thoughts, photos, and moments in rich entries.",
      imageUrl: "/screenshots/journal-tokyo-ds.png",
    },
    {
      id: 5,
      title: "Tasks",
      description: "Stay on top of to-dos with flexible task lists.",
      imageUrl: "/screenshots/tasks.png",
    },
    {
      id: 6,
      title: "Events",
      description: "Plan events and important dates with ease.",
      imageUrl: "/screenshots/events.png",
    },
    {
      id: 7,
      title: "Itineraries",
      description: "Map out your travel or day plans step by step.",
      imageUrl: "/screenshots/itineraries.png",
    },
    {
      id: 8,
      title: "Goals",
      description: "Track your long-term goals and daily progress.",
      imageUrl: "/screenshots/goals.png",
    },
    {
      id: 9,
      title: "Characters",
      description: "Keep notes and reminders for people in your life.",
      imageUrl: "/screenshots/characters.png",
    },
    {
      id: 10,
      title: "Settings",
      description: "Customize your experience and preferences.",
      imageUrl: "/screenshots/settings.png",
    },
  ];

  const extendToMinSize = (
    array: {
      id: number;
      title: string;
      description: string;
      imageUrl: string;
    }[],
    minSize = 5
  ) => {
    if (array.length === 0) return []; // Handle edge case for empty input array

    const timesToExtend = Math.ceil(minSize / array.length); // Calculate how many times to extend
    const extendedArray = Array(timesToExtend).fill(array).flat(); // Extend the array

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

    const baseStyles = {
      position: "absolute",
      transition: "all 500ms ease-out",
    };

    switch (position) {
      case 0:
        return {
          ...baseStyles,
          transform: "translateX(-172%) scale(0.6)",
          opacity: 0,
          zIndex: 1,
        };
      case 1: // Left card
        return {
          ...baseStyles,
          transform: "translateX(-96%) scale(0.8)",
          opacity: 0.9,
          zIndex: 1,
        };
      case 2: // Center card
        return {
          ...baseStyles,
          transform: "translateX(0%) scale(1)",
          opacity: 1,
          zIndex: 2,
        };
      case 3: // Right card
        return {
          ...baseStyles,
          transform: "translateX(96%) scale(0.8)",
          opacity: 0.9,
          zIndex: 1,
        };
      case 4:
        return {
          ...baseStyles,
          transform: "translateX(172%) scale(0.6)",
          opacity: 0,
          zIndex: 1,
        };

      default:
        return {
          ...baseStyles,
          transform: "translateX(0%) scale(0.6)",
          opacity: 0,
          zIndex: -1,
        };
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventScrollOnSwipe: true, // Prevent browser scroll during swipe
    trackMouse: true,
  });

  return (
    <div
      {...swipeHandlers} // Add swipe handlers here
      className="my-8 relative w-full mx-auto h-[60rem] flex items-center justify-center pointer-events-auto"
    >
      <h3 className="absolute top-32 sm:top-24 text-xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
        App Previews
      </h3>
      <div className="absolute  top-1/2 -translate-y-1/2  w-screen max-w-7xl h-full overflow-hidden flex justify-center">
        <button
          onClick={handlePrev}
          className="md:hidden absolute top-1/2 -translate-y-1/2 left-0 z-10 p-2 rounded-full bg-black/70  transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="text-white w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="md:hidden absolute top-1/2 -translate-y-1/2 right-0 z-10 p-2 rounded-full bg-black/70  transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="text-white w-6 h-6" />
        </button>
        <div className="absolute w-full max-w-7xl flex justify-center">
          {projects.map((project, index) => (
            <div
              key={project.id + index}
              style={getItemStyles(index) as CSSProperties}
              className="w-5/6 md:w-1/3 pt-44"
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
    </div>
  );
}
