"use client";

import { useEffect, useRef } from "react";

interface ParallaxSceneProps {
  children: React.ReactNode;
}

export function ParallaxScene({ children }: ParallaxSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sceneRef.current) return;

      const layers = sceneRef.current.querySelectorAll(".layer");
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      layers.forEach((layer, i) => {
        if (i < 3) {
          // Only apply parallax to the first 3 (background) layers
          const depth = (3 - i) * 0.002; // Reduced depth for less extreme movement
          const moveX = mouseX * depth;
          const moveY = mouseY * depth;

          (
            layer as HTMLElement
          ).style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        }
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={sceneRef} className="parallax-scene">
      <div className="layer" data-depth="0.03">
        <div className="layer-5 layer-photo" />
      </div>
      <div className="layer" data-depth="0.02">
        <div className="layer-4 layer-photo" />
      </div>
      <div className="layer" data-depth="0.01">
        <div className="layer-3 layer-photo" />
      </div>
      <div className="layer">
        <div className="layer-2 layer-photo" />
      </div>
      <div className="layer">
        <div className="layer-1 layer-photo" />
      </div>
      <div className="layer snow-ground"></div>
      {children}
    </div>
  );
}
