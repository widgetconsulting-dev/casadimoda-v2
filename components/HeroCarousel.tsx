"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  type: "image" | "video";
  src: string;
  alt?: string;
  title: string;
  subtitle: string;
  description: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoplayInterval?: number;
}

export default function HeroCarousel({
  slides,
  autoplayInterval = 5000,
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(140);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Dynamically calculate header height
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector("header");
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    updateHeaderHeight();

    // Update on resize
    window.addEventListener("resize", updateHeaderHeight);

    // Use MutationObserver to detect header changes (like announcement bar closing)
    const observer = new MutationObserver(updateHeaderHeight);
    const header = document.querySelector("header");
    if (header) {
      observer.observe(header, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      observer.disconnect();
    };
  }, []);

  // Control video playback based on current slide
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentSlide) {
          video.play().catch((error) => {
            console.log("Video autoplay failed:", error);
          });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentSlide]);

  useEffect(() => {
    if (!isPaused && slides.length > 1) {
      const interval = setInterval(nextSlide, autoplayInterval);
      return () => clearInterval(interval);
    }
  }, [isPaused, nextSlide, autoplayInterval, slides.length]);

  const currentSlideData = slides[currentSlide];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: `calc(100vh - ${headerHeight}px)` }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Media */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {slide.type === "image" ? (
              <img
                src={slide.src}
                alt={slide.alt || slide.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={slide.src}
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="max-w-2xl">
            <h2 className="text-white/90 font-bold uppercase tracking-[0.3em] text-xs mb-4 animate-fade-in">
              {currentSlideData.subtitle}
            </h2>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 animate-fade-in">
              {currentSlideData.title}
            </h1>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8 animate-fade-in">
              {currentSlideData.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Link
                href={currentSlideData.cta1Link}
                className="bg-accent text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-primary transition-all shadow-lg text-center"
              >
                {currentSlideData.cta1Text}
              </Link>
              <Link
                href={currentSlideData.cta2Link}
                className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-primary transition-all text-center"
              >
                {currentSlideData.cta2Text}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all group"
            aria-label="Previous slide"
          >
            <ChevronLeft
              size={24}
              className="text-white group-hover:scale-110 transition-transform"
            />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all group"
            aria-label="Next slide"
          >
            <ChevronRight
              size={24}
              className="text-white group-hover:scale-110 transition-transform"
            />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentSlide
                  ? "w-12 h-3 bg-accent"
                  : "w-3 h-3 bg-white/50 hover:bg-white/80"
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
