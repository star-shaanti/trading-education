interface AdSlotProps {
  format?: "banner" | "rectangle" | "sidebar";
  className?: string;
}

export function AdSlot({ format = "banner", className = "" }: AdSlotProps) {
  const heights: Record<string, string> = {
    banner: "min-h-[120px]",
    rectangle: "min-h-[250px]",
    sidebar: "min-h-[600px]",
  };

  return (
    <div
      role="complementary"
      aria-label="advertisement"
      className={`${heights[format]} w-full grid place-items-center
        bg-slate-50 dark:bg-slate-900 text-slate-400 text-sm
        border border-slate-200 dark:border-slate-800
        rounded-2xl ${className}`}
    >
      {/* Placeholder - Replace with AdSense script when ready */}
      {/* 
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX`}
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format={format === "banner" ? "auto" : format}
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      */}
      <span className="text-xs">Advertisement Space</span>
    </div>
  );
}

