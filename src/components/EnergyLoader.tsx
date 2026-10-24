import type { CSSProperties } from "react";

export default function EnergyLoader({
  label = "Charging up",
  launch = false,
}: {
  label?: string;
  launch?: boolean;
}) {
  return (
    <div className={"energy-loader" + (launch ? " launch" : "")} role="status" aria-live="polite">
      {launch ? <div className="warp" aria-hidden /> : null}
      <div className="energy-stage">
        <div className="energy-aura" />
        <div className="energy-ring r1" />
        <div className="energy-ring r2" />
        <div className="energy-ring r3" />
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="energy-p"
            style={{ "--a": `${i * 36}deg`, "--i": i } as CSSProperties}
          />
        ))}
        <div className="energy-core">
          <span className="swirl s1" />
          <span className="swirl s2" />
          <span className="swirl s3" />
        </div>
      </div>
      <p className="energy-label">{label}</p>
      <div className="energy-bar"><i /></div>
    </div>
  );
}
