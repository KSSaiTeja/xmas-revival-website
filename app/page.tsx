"use client";

import { useState, useEffect } from "react";
import { ContactForm } from "@/components/contact-form";
import { ParallaxScene } from "@/components/parallax-scene";
import { SnowEffect } from "@/components/snow-effect";
import { Logo } from "@/components/logo";
import Image from "next/image";
// import heroImage from "@/public/hero image.svg";
import heroImage2 from "@/public/hero image2.svg";
import { GiftBoxes } from "@/components/gift-boxes";
import { SpeechBubble } from "@/components/speech-bubble";

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Prevent zooming
    const viewport = document.querySelector("meta[name=viewport]");
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      );
    }

    // Check if form has been submitted
    const storedData = localStorage.getItem("christmasFormData");
    if (storedData) {
      setIsSubmitted(true);
    }
  }, []);

  const handleSubmit = () => {
    // Smooth scroll to top before showing gift boxes
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#0a4275] via-[#0a4275] to-[#0a4275]">
      <SnowEffect />
      <Logo />
      <ParallaxScene>
        <main className="relative flex flex-col items-center z-10 min-h-screen py-8">
          <h1
            className="font-great-vibes text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white text-center mt-16 sm:mt-20 mx-4 mb-8"
            style={{
              textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
              lineHeight: "1.3",
            }}
          >
            <span className="md:hidden">
              Merry Christmas
              <br />
              &
              <br />
              Happy New Year
            </span>
            <span className="hidden md:inline">
              Merry Christmas & Happy New Year
            </span>
          </h1>

          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[95vw] px-4 py-4">
            <div className="relative flex flex-col items-center">
              <div className="relative w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px] aspect-[2/3] mb-4">
                {!isSubmitted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4">
                    <SpeechBubble />
                  </div>
                )}
                <Image
                  // src={heroImage}
                  src={heroImage2}
                  alt="Christmas Hero"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="w-full">
                {!isSubmitted ? (
                  <ContactForm onSubmit={handleSubmit} />
                ) : (
                  <GiftBoxes />
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            {[
              {
                name: "Youtube",
                url: "/Youtube.png",
                href: "https://www.youtube.com/c/savart",
              },
              {
                name: "LinkedIn",
                url: "/Linkedin.png",
                href: "https://www.linkedin.com/company/savarthq/",
              },
              {
                name: "Instagram",
                url: "/Instagram.png",
                href: "https://www.instagram.com/savart.hq/?hl=en",
              },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <Image
                  src={social.url}
                  alt={social.name}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </a>
            ))}
          </div>
        </main>
      </ParallaxScene>
    </div>
  );
}
