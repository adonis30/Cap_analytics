"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

const slides = [
  { image: "/assets/images/cap2.jpg", caption: "" },
  { image: "/assets/images/cap4.jpg", caption: "" },
  { image: "/assets/images/cap1.jpg", caption: "" },
  { image: "/assets/images/cap5.jpg", caption: "" },
];

export default function CarouselBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full h-[60vh] overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-full h-[75vh] relative flex items-end justify-center"
            >
              <Image
                src={slide.image}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex items-end">
                <h2 className="text-white text-2xl md:text-4xl font-semibold drop-shadow-lg">
                  {slide.caption}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Prev/Next Buttons */}
      <Button
        onClick={scrollPrev}
        variant="secondary"
        size="icon"
        className="absolute top-1/2 left-4 -translate-y-1/2 z-10"
      >
        ←
      </Button>
      <Button
        onClick={scrollNext}
        variant="secondary"
        size="icon"
        className="absolute top-1/2 right-4 -translate-y-1/2 z-10"
      >
        →
      </Button>
    </div>
  );
}
