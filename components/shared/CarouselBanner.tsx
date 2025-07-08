"use client";

import React from "react";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import "keen-slider/keen-slider.min.css";

const slides = [
  { image: "/assets/images/Hero_Sectio.png", caption: "" },
  { image: "/assets/images/Cap-Analytics_Intro.png", caption: "" },
  { image: "/assets/images/landing1.png", caption: "" },
  { image: "/assets/images/visually1.png", caption: "" },
  { image: "/assets/images/We_Serve.png", caption: "" },
];

const CarouselBanner = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: {
      perView: 1,
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider w-full">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className="keen-slider__slide relative w-full"
          style={{ aspectRatio: "16 / 6" }} // ⬅️ Reduced height
        >
          <Image
            src={slide.image}
            alt={`Slide ${idx + 1}`}
            layout="fill"
            className="object-cover"
            priority
          />
          {slide.caption && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h2 className="text-white text-2xl md:text-4xl font-bold text-center px-4">
                {slide.caption}
              </h2>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CarouselBanner;
