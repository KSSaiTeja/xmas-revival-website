"use client";

import { useState, useRef } from "react";
import confetti from "canvas-confetti";

interface GiftBoxProps {
  onOpen: (element: HTMLDivElement) => void;
  disabled?: boolean;
}

export function GiftBox({ onOpen, disabled }: GiftBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (disabled || isOpen || !boxRef.current) return;

    setIsOpen(true);
    const rect = boxRef.current.getBoundingClientRect();
    const x = (rect.left + rect.right) / 2 / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
    });

    setTimeout(() => {
      if (boxRef.current) {
        onOpen(boxRef.current);
      }
    }, 1000);
  };

  return (
    <div className="box">
      <div
        ref={boxRef}
        className={`box-body ${isOpen ? "open" : ""} ${
          disabled ? "opacity-50" : ""
        }`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Gift box"
        aria-disabled={disabled}
      >
        <div className="box-lid">
          <div className="box-bowtie"></div>
        </div>
      </div>
    </div>
  );
}
