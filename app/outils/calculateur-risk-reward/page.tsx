"use client";

import BackButton from "@/components/BackButton";
import Tool from "../../../outils/calculateur-risk-reward";

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-6">
      <BackButton />
      <Tool />
    </div>
  );
}

