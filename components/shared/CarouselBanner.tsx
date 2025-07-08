"use client";

import React from "react";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";

const slides = [
  {
    image: "/assets/images/Hero_Sectio.png",
  
  },
  {
    image: "/assets/images/Cap-Analytics_Intro.png",
    
  },
  {
    image: "/assets/images/landing1.png",
    
  },
  {
    image: "/assets/images/visually1.png",
    
  },
  {
    image: "/assets/images/We_Serve.png",
    
  },
  {
    image: "/assets/images/We_Serve.png",
    
  },
];

const CarouselBanner = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: {
      perView: 1,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 1 },
      },
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider h-[70vh] overflow-hidden">
      {slides.map((slide, idx) => (
        <div key={idx} className="keen-slider__slide relative">
          <Image
            src={slide.image}
            alt={slide.caption}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-white text-2xl md:text-4xl font-bold text-center px-4">
              {slide.caption}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarouselBanner;
