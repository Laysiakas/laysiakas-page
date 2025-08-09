"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DemoCTA() {
  const [pulse, setPulse] = useState(false);

  const handleClick = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 450);
  };

  return (
    <Button
      asChild
      variant="outline"
      size="lg"
      className="relative rounded-2xl transition-transform active:scale-[0.98] overflow-hidden"
      aria-label="Peržiūrėti demo"
    >
      <Link href="/shop" onClick={handleClick}>
        <span className="relative z-10">Peržiūrėti demo</span>
        {pulse && (
          <span
            className="pointer-events-none absolute inset-0 rounded-2xl bg-white/20 animate-ping"
            aria-hidden="true"
          />
        )}
      </Link>
    </Button>
  );
}
