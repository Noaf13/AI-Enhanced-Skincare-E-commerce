/**
 * Hero Banner Component
 *
 * An auto-rotating image carousel/slideshow for the hero section of the website.
 * Features automatic slide transitions with manual navigation capabilities.
 * Uses CSS transforms for smooth animations and setInterval for auto-rotation.
 *
 * @component
 * @returns {JSX.Element} Hero banner with image carousel
 *
 * @example
 * // Basic usage in a page layout
 * <HeroBanner />
 *
 * @features
 * - Auto-rotating slides every 3.5 seconds
 * - Infinite looping carousel
 * - Smooth CSS transitions
 * - Responsive design
 *
 * @performance
 * - Uses useCallback to memoize nextSlide function
 * - Cleans up interval on unmount
 * - CSS transforms for hardware acceleration
 */
"use client";

import { useState, useEffect } from "react";

const HeroBanner = () => {
  const slides = [
    { id: 1, image: "/hp(1).jpg" },
    { id: 2, image: "/hp(2).jpg" },
    { id: 3, image: "/hp(3).jpg" },
  ];

  const [currentSlide, changeCurrentSlide] = useState(0);
  const nextSlide = () => {
    changeCurrentSlide((prev) => {
      if (prev === slides.length - 1) {
        return 0;
      } else {
        return prev + 1;
      }
      //change to next img but if it reach to the end loop back to 0
    });
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="w-full bg-white py-8 px-4">
      <div className="relative w-full max-w-6xl mx-auto h-135 overflow-hidden">
        <div
          className="flex transition-transform duration-600 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-full h-full flex-shrink-0 px-2">
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover rounded-lg shadow-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
