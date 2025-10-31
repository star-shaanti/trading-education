"use client";

import { useEffect } from "react";

export function AdSenseScript() {
  useEffect(() => {
    // Créer le script AdSense dans le head
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5343389597650456";
    script.crossOrigin = "anonymous";
    
    // S'assurer qu'il n'existe pas déjà
    const existingScript = document.querySelector(
      'script[src*="adsbygoogle.js?client=ca-pub-5343389597650456"]'
    );
    
    if (!existingScript) {
      document.head.appendChild(script);
    }
  }, []);

  return null;
}

