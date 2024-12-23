"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import Image from "next/image";

export function OfferPopup({ offer }: { offer: number }) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white rounded-lg p-8 text-center max-w-sm w-full mx-4">
        <h3 className="text-2xl font-bold mb-4">Congratulations!</h3>
        <p className="text-4xl font-bold text-red-600 mb-6">
          You&apos;ve won ₹{offer} off!
        </p>
        <p className="text-xl mb-8">on Savart X</p>
        <p className="mb-6">Thank you for participating!</p>
        <p className="mb-4 text-gray-600">Check out our socials:</p>
        <div className="flex justify-center space-x-6">
          <a
            href="#"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <Image
              src="http://awesome-coding.com/theme/images/icons/facebook.png"
              alt="Facebook"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </a>
          <a
            href="#"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <Image
              src="http://awesome-coding.com/theme/images/icons/twitter.png"
              alt="Twitter"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </a>
          <a
            href="#"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <Image
              src="http://awesome-coding.com/theme/images/icons/instagram.png"
              alt="Instagram"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
