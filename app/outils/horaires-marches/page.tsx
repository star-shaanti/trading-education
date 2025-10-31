"use client";

import BackButton from "@/components/BackButton";
import Tool from "../../../outils/horaires-marches";

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-6">
      <BackButton />
      <Tool />
    </div>
  );
}

