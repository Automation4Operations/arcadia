"use client";

import { useEffect, useRef } from "react";

type AdBannerProps = {
  slot?: string;
  client?: string;
  format?: "auto" | "horizontal" | "rectangle" | "vertical";
  className?: string;
};

const DEFAULT_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-9212888811032637";

export default function AdBanner({
  slot = "1234567890",
  client = DEFAULT_CLIENT,
  format = "auto",
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  const isLive = client && client.startsWith("ca-pub-") && client !== "ca-pub-XXXXXXXXXXXXXXXX";

  useEffect(() => {
    if (!isLive || pushed.current) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      (w.adsbygoogle = w.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Ad blocker or push error ignored
    }
  }, [isLive]);

  const styleMap = {
    auto: "w-full min-h-[90px] max-w-[970px]",
    horizontal: "w-full max-w-[728px] min-h-[90px] mx-auto",
    rectangle: "w-full max-w-[300px] min-h-[250px] mx-auto",
    vertical: "w-[160px] min-h-[600px] hidden xl:flex",
  };

  return (
    <div
      className={`relative my-4 overflow-hidden rounded-2xl border border-edge/60 bg-panel/40 p-2.5 text-center flex flex-col items-center justify-center backdrop-blur-sm transition-all hover:border-arcade/30 ${styleMap[format]} ${className}`}
    >
      <span className="mb-1 text-[9px] font-black uppercase tracking-widest text-mute/50 select-none">
        Advertisement
      </span>

      {isLive ? (
        <ins
          ref={adRef}
          className="adsbygoogle block w-full"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format === "auto" ? "auto" : undefined}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-3 text-xs text-mute/70">
          <div className="flex items-center gap-1.5 font-bold text-fg/80">
            <span>⚡</span>
            <span>Google AdSense Slot</span>
          </div>
          <span className="text-[10px] text-mute mt-0.5">
            Active via {client}
          </span>
        </div>
      )}
    </div>
  );
}
