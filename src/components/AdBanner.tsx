"use client";

type AdProps = {
  format?: "leaderboard" | "rectangle" | "skyscraper";
  className?: string;
};

export default function AdBanner({ format = "leaderboard", className = "" }: AdProps) {
  const formatStyles = {
    leaderboard: "w-full max-w-[728px] min-h-[90px] mx-auto my-4",
    rectangle: "w-full max-w-[300px] min-h-[250px] mx-auto my-4",
    skyscraper: "w-[160px] min-h-[600px] hidden xl:flex",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-edge/70 bg-panel/60 p-3 text-center flex flex-col items-center justify-center backdrop-blur-md shadow-inner transition-all hover:border-arcade/40 ${formatStyles[format]} ${className}`}
    >
      <span className="absolute top-1.5 right-2.5 text-[9px] font-extrabold tracking-widest text-mute/50 uppercase select-none">
        Sponsored
      </span>
      <div className="text-xs font-bold text-mute/80 flex flex-col items-center gap-1">
        <span className="text-arcade-soft">⚡ Arcadia Ad Partner ({format})</span>
        <span className="text-[10px] text-mute">GameMonetize / Ad Network Slot</span>
      </div>
    </div>
  );
}
