"use client";

import React from "react";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import "keen-slider/keen-slider.min.css";

const slides = [
  { image: "/assets/images/Hero_Sectio.png", caption: "Empowering Africa's Data Economy" },
  { image: "/assets/images/Cap-Analytics_Intro.png", caption: "Visualize Trends. Unlock Value." },
  { image: "/assets/images/landing1.png", caption: "Intelligence that Drives Investment" },
  { image: "/assets/images/visually1.png", caption: "Insightful Charts. Real-time Analytics." },
  { image: "/assets/images/We_Serve.png", caption: "Serving Businesses Across Africa" },
];

function AutoplayPlugin(delay = 5000) {
  return (slider: any) => {
    let timeout: any;
    let mouseOver = false;

    const nextTimeout = () => {
      clearTimeout(timeout);
      if (!mouseOver) timeout = setTimeout(() => slider.next(), delay);
    };

    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => (mouseOver = true));
      slider.container.addEventListener("mouseout", () => {
        mouseOver = false;
        nextTimeout();
      });
      nextTimeout();
    });

    slider.on("dragStarted", () => clearTimeout(timeout));
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  };
}

const CarouselBanner = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: { perView: 1 },
    },
    [AutoplayPlugin(5000)]
  );

  return (
    <div ref={sliderRef} className="keen-slider w-full aspect-[16/6] relative">
      {slides.map((slide, idx) => (
        <div key={idx} className="keen-slider__slide relative">
          <Image
            src={slide.image}
            alt={`Slide ${idx + 1}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center p-6">
            <h2 className="text-white text-xl md:text-3xl font-bold text-center drop-shadow-lg">
              {slide.caption}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarouselBanner;
