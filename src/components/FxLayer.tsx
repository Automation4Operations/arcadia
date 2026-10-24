"use client";

import { useEffect, useRef, useState } from "react";
import EnergyLoader from "./EnergyLoader";

export default function FxLayer() {
  const [busy, setBusy] = useState(false);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    let target = "";

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
      setBusy(false);
    };

    // Show the energy loader the instant an internal link is clicked
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const next = url.pathname + url.search;
      const now = window.location.pathname + window.location.search;
      if (next === now || (url.hash && url.pathname === window.location.pathname)) return;

      target = next;
      setBusy(true);
      if (timer) clearInterval(timer);
      const started = Date.now();
      timer = setInterval(() => {
        const cur = window.location.pathname + window.location.search;
        if (cur === target || Date.now() - started > 8000) stop();
      }, 120);
    };

    // Click burst ring at the pointer
    const onDown = (e: PointerEvent) => {
      const b = document.createElement("div");
      b.className = "click-burst";
      b.style.left = e.clientX + "px";
      b.style.top = e.clientY + "px";
      document.body.appendChild(b);
      setTimeout(() => b.remove(), 650);
    };

    // Soft glow that follows the mouse (desktop only)
    let raf = 0;
    let x = 0;
    let y = 0;
    const canHover = window.matchMedia("(hover: hover)").matches;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (glow.current) glow.current.style.transform = `translate3d(${x - 150}px, ${y - 150}px, 0)`;
        });
      }
    };

    document.addEventListener("click", onClick);
    document.addEventListener("pointerdown", onDown);
    if (canHover) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      if (timer) clearInterval(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={glow} className="cursor-glow" aria-hidden />
      {busy && <EnergyLoader />}
    </>
  );
}
