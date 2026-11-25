"use client";

import { useEffect, useRef, useState } from "react";

type AdBannerProps = {
  slot?: string;
  client?: string;
  format?: "auto" | "horizontal" | "rectangle" | "vertical";
  className?: string;
};

const DEFAULT_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-9212888811032637";

const SLOT_BY_FORMAT: Record<NonNullable<AdBannerProps["format"]>, string | undefined> = {
  auto: process.env.NEXT_PUBLIC_ADSENSE_SLOT_AUTO,
  horizontal: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL || process.env.NEXT_PUBLIC_ADSENSE_SLOT_AUTO,
  rectangle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE || process.env.NEXT_PUBLIC_ADSENSE_SLOT_AUTO,
  vertical: process.env.NEXT_PUBLIC_ADSENSE_SLOT_VERTICAL || process.env.NEXT_PUBLIC_ADSENSE_SLOT_AUTO,
};

export default function AdBanner({
  slot,
  client = DEFAULT_CLIENT,
  format = "auto",
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [adUnfilled, setAdUnfilled] = useState(false);

  const resolvedSlot = slot || SLOT_BY_FORMAT[format] || "";
  const isValidSlot = /^\d{6,}$/.test(resolvedSlot) && resolvedSlot !== "1234567890";
  const isLive = Boolean(
    client && client.startsWith("ca-pub-") && client !== "ca-pub-XXXXXXXXXXXXXXXX" && isValidSlot
  );

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

  // Hide only AFTER AdSense explicitly marks the slot as unfilled (never before, or width=0 blocks filling)
  useEffect(() => {
    const ins = adRef.current;
    if (!ins) return;
    const sync = () => {
      const status = ins.getAttribute("data-ad-status");
      if (status === "unfilled") setAdUnfilled(true);
      else if (status === "filled") setAdUnfilled(false);
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });
    return () => observer.disconnect();
  }, []);

  const styleMap = {
    auto: "w-full min-h-[90px] max-w-[970px]",
    horizontal: "w-full max-w-[728px] min-h-[90px] mx-auto",
    rectangle: "w-full max-w-[300px] min-h-[250px] mx-auto",
    vertical: "w-[160px] min-h-[600px] hidden xl:flex",
  };

  if (!isLive || adUnfilled) return null;

  return (
    <div
      className={`ad-slot-box relative my-6 overflow-hidden rounded-2xl border border-edge/60 bg-panel/60 p-3 text-center flex flex-col items-center justify-center backdrop-blur-sm transition-all hover:border-arcade/30 ${styleMap[format]} ${className}`}
    >
      <span className="mb-1 text-[9px] font-black uppercase tracking-widest text-mute/50 select-none">
        Advertisement
      </span>
      <ins
        ref={adRef}
        className="adsbygoogle block w-full"
        style={{ display: "block", backgroundColor: "transparent" }}
        data-ad-client={client}
        data-ad-slot={resolvedSlot}
        data-ad-format={format === "auto" ? "auto" : undefined}
        data-full-width-responsive="true"
      />
    </div>
  );
}
