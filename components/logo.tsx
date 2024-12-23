import Image from "next/image";
import { useState } from "react";

export function Logo() {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="absolute top-6 left-6 z-20 text-white font-bold">
        Logo
      </div>
    );
  }

  return (
    <div className="absolute top-6 left-6 z-20">
      <Image
        src="/logo.png"
        alt="Logo"
        width={64}
        height={64}
        className="w-auto h-auto"
        onError={() => setError(true)}
      />
    </div>
  );
}
