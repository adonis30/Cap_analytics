"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

const slides = [
  { image: "/assets/images/cap2.jpg", caption: "Empower Data", link: "/about" },
  { image: "/assets/images/cap4.jpg", caption: "Insights that Matter", link: "/services" },
  { image: "/assets/images/cap1.jpg", caption: "Africa’s Business Pulse", link: "/charts" },
  { image: "/assets/images/cap5.jpg", caption: "Invest Smart", link: "/invest" },
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
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <Link
              href={slide.link}
              key={index}
              className="min-w-full h-[70vh] relative block"
            >
              <div className="relative w-full h-full flex items-end justify-center">
                <Image
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-end p-10 text-center">
                  <h2 className="text-white text-2xl md:text-4xl font-bold drop-shadow mb-4">
                    {slide.caption}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
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
