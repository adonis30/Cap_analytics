"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

const slides = [
  { image: "/assets/images/cap2.jpg", caption: "Explore Investment Opportunities" },
  { image: "/assets/images/cap4.jpg", caption: "Empowering Entrepreneurs" },
  { image: "/assets/images/cap1.jpg", caption: "Growth in Zambia" },
  { image: "/assets/images/cap5.jpg", caption: "Innovation & Impact" },
   { image: "/assets/images/cap1a.png", caption: "Growth in Zambia" },
];

export default function CarouselBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {/* Embla viewport */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
               className="min-w-full relative aspect-[16/9] sm:aspect-auto sm:h-[80vh] flex items-center justify-center"
              

            >
              <Image
  src={slide.image}
  alt={`Slide ${index + 1}`}
  fill
  className="object-fill"
  priority
  style={{ objectPosition: "center", objectFit: "cover" }} // Add this
/>


              {/* Caption + Overlay Button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-end p-10 text-center">
                <h2 className="text-white text-2xl md:text-4xl font-bold drop-shadow mb-4">
                  {slide.caption}
                </h2>
                <div className="flex gap-4">
                  <Button variant="default">Explore Now</Button>
                  <Button variant="outline">Get Investment Ready</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev/Next Navigation */}
      <Button
        onClick={scrollPrev}
        size="icon"
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white hover:bg-black/70 z-20"
      >
        ←
      </Button>
      <Button
        onClick={scrollNext}
        size="icon"
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white hover:bg-black/70 z-20"
      >
        →
      </Button>
    </div>
  );
}
