"use client";

import { useState, useEffect, useRef } from "react";
import { GiftBox } from "./gift-box";
import dynamic from "next/dynamic";
import { offers } from "@/config/offers";

const GiftRevealPopup = dynamic(() => import("./gift-reveal-popup"), {
  loading: () => <p>Loading...</p>,
});

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function GiftBoxes() {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [hasSelected, setHasSelected] = useState(false);
  const [selectedBoxPosition, setSelectedBoxPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [shuffledOffers, setShuffledOffers] = useState(offers);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedOffer = localStorage.getItem("christmasSelectedOffer");
    const storedPosition = localStorage.getItem("christmasSelectedPosition");

    if (storedOffer) {
      setSelectedOffer(storedOffer);
      setHasSelected(true);
      if (storedPosition) {
        setSelectedBoxPosition(JSON.parse(storedPosition));
      }
    } else {
      setShuffledOffers(shuffleArray(offers));
    }

    // Preload the GiftRevealPopup component
    import("./gift-reveal-popup");
  }, []);

  const handleGiftOpen = async (index: number, element: HTMLDivElement) => {
    if (hasSelected) return;

    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.right) / 2 / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    const position = { x, y };
    setSelectedBoxPosition(position);
    setHasSelected(true);

    // Optimistically select an offer
    const selectedDiscount = shuffledOffers[index].discount;
    const instantOffer = `₹${selectedDiscount}`;
    setSelectedOffer(instantOffer);
    localStorage.setItem("christmasSelectedOffer", instantOffer);
    localStorage.setItem("christmasSelectedPosition", JSON.stringify(position));

    try {
      const entryId = localStorage.getItem("christmasEntryId");
      if (!entryId) {
        throw new Error("No entry found. Please fill the form first.");
      }

      // Perform the API call asynchronously without waiting for the response
      const response = await fetch("/api/select-gift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entryId: parseInt(entryId), selectedDiscount }),
      });

      if (!response.ok) {
        throw new Error("Failed to select gift");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // If the server returns a different offer, update it
      if (data.gift !== instantOffer) {
        setSelectedOffer(data.gift);
        localStorage.setItem("christmasSelectedOffer", data.gift);
      }
    } catch (error) {
      console.error("Error selecting gift:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again.",
      );
      // In case of error, we keep the optimistically selected offer
    }
  };

  if (selectedOffer) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <GiftRevealPopup
          gift={selectedOffer}
          permanent={true}
          position={selectedBoxPosition || { x: 0.5, y: 0.5 }}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto px-4 pt-4 pb-8">
      <h2 className="text-2xl font-bold text-white text-center mb-16">
        Choose Your Gift!
      </h2>
      {errorMessage && (
        <div className="text-red-500 text-center mb-4">{errorMessage}</div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20 md:gap-x-16 lg:gap-x-24 justify-items-center">
        {shuffledOffers.map((offer, index) => (
          <div key={index} className="w-full flex items-center justify-center">
            <GiftBox
              onOpen={(element) => handleGiftOpen(index, element)}
              disabled={hasSelected}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
