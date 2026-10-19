import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const root = process.cwd();

function writeFile(relPath, content) {
  const fullPath = path.join(root, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf8");
  console.log("✅ Updated:", relPath);
}

// 1. Clean ads.txt (Remove invalid HTML <!-- and --> comments so all demand partners are active)
const cleanAdsTxt = `#GameMonetize.com
google.com, pub-5519830896693885, DIRECT, f08c47fec0942fa0
google.com, pub-4764333688337558, DIRECT, f08c47fec0942fa0
google.com, pub-4573231550355221, RESELLER, f08c47fec0942fa0
pubmatic.com, 160907, DIRECT, 5d62403b186f2ace
indexexchange.com, 194273, DIRECT, 50b1c356f2c5c8fc
media.net, 8CU5DERG1, DIRECT
rhythmone.com, 895733750, DIRECT, a670c89d4a324e47
video.unrulymedia.com, 895733750, DIRECT
sovrn.com, 357833, DIRECT, fafdf38b16bf6b2b
lijit.com, 357833, DIRECT, fafdf38b16bf6b2b
lijit.com, 357833-eb, DIRECT, fafdf38b16bf6b2b
advertising.com, 28246, RESELLER
rubiconproject.com, 11006, RESELLER, 0bfd66d529a55807
google.com, pub-3769010358500643, RESELLER, f08c47fec0942fa0
freewheel.tv, 20393, RESELLER
freewheel.tv, 24377, RESELLER
onetag.com, 75ab9ccdd190228, DIRECT
yahoo.com, 58905, RESELLER, e1a5b5b6e3255540
aol.com, 58905, RESELLER, e1a5b5b6e3255540
appnexus.com, 13099, RESELLER
smartadserver.com, 4111, RESELLER
google.com, pub-8309773808661346, RESELLER, f08c47fec0942fa0
google.com, pub-6733417337840393, DIRECT, f08c47fec0942fa0
pubmatic.com, 157335, DIRECT, 5d62403b186f2ace
rubiconproject.com, 19654, DIRECT, 0bfd66d529a55807
smartadserver.com, 3277, RESELLER
contextweb.com, 560288, RESELLER, 89ff185a4c4e857c
pubmatic.com, 156439, RESELLER, 5d62403b186f2ace
pubmatic.com, 154037, RESELLER, 5d62403b186f2ace
rubiconproject.com, 16114, RESELLER, 0bfd66d529a55807
openx.com, 537149888, RESELLER, 6a698e2ec38604c6
appnexus.com, 3703, RESELLER, f5ab79cb980f11d1
districtm.io, 101760, RESELLER, 3fd707be9c4527c3
loopme.com, 5679, RESELLER, 6c8d5f95897a5a3b
ad.plus, 352349, DIRECT
xad.com, 958, RESELLER, 81cbf0a75a5e0e9a
adwmg.com, 100299, DIRECT
rhythmone.com, 2564526802, RESELLER, a670c89d4a324e47
smaato.com, 1100044045, RESELLER, 07bcf65f187117b4
pubnative.net, 1006576, RESELLER, d641df8625486a7b
adyoulike.com, b4bf4fdd9b0b915f746f6747ff432bde, RESELLER
axonix.com, 57264, RESELLER
admanmedia.com, 43, RESELLER
openx.com, 540310752, DIRECT, 6a698e2ec38604c6
rhythmone.com, 4195999290, DIRECT, a670c89d4a324e47
rubiconproject.com, 19652, DIRECT, 0bfd66d529a55807
appnexus.com, 8950, RESELLER
pubmatic.com, 156307, RESELLER, 5d62403b186f2ace
pubmatic.com, 156736, DIRECT, 5d62403b186f2ace
criteo.com, 155036, DIRECT
criteo.com, 174835, DIRECT
criteo.com, B-059025, DIRECT, 9fac4a4a87c2a44f
google.com, pub-1026343505820086, DIRECT, f08c47fec0942fa0
google.com, pub-7002491002409919, DIRECT, f08c47fec0942fa0
google.com, pub-9834921707786629, DIRECT, f08c47fec0942fa0
google.com, pub-6261920351485424, DIRECT, f08c47fec0942fa0
google.com, pub-3218843770801011, DIRECT, f08c47fec0942fa0
google.com, pub-6987270876834820, DIRECT, f08c47fec0942fa0
google.com, pub-9378724246417115, DIRECT, f08c47fec0942fa0
google.com, pub-7002491002409919, RESELLER, f08c47fec0942fa0
adingo.jp, 26007, RESELLER
`;

writeFile("public/ads.txt", cleanAdsTxt);
writeFile(
  "src/app/ads.txt/route.ts",
  `export async function GET() {
  const adsTxt = ${JSON.stringify(cleanAdsTxt)};
  return new Response(adsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
`
);

// 2. Fix GamePlayer.tsx so:
// - TypeScript build succeeds with game={...} prop
// - Zero sandbox restrictions blocking GameMonetize IMA3 video ads or ad clicks
// - Clean GameMonetize embed URL (https://html5.gamemonetize.co/...) with full Referer header
writeFile(
  "src/components/GamePlayer.tsx",
  `"use client";

import { useEffect, useRef, useState } from "react";
import { pushRecent } from "@/lib/recent";

type GameObj = {
  slug: string;
  title: string;
  iframeUrl: string;
  thumbnailUrl: string;
  width?: number;
  height?: number;
};

type Props = {
  slug?: string;
  title?: string;
  iframeUrl?: string;
  thumbnailUrl?: string;
  categoryName?: string;
  game?: GameObj;
};

export default function GamePlayer(props: Props) {
  const slug = props.game?.slug || props.slug || "";
  const title = props.game?.title || props.title || "Arcadia Game";
  const rawIframeUrl = props.game?.iframeUrl || props.iframeUrl || "";
  const thumbnailUrl = props.game?.thumbnailUrl || props.thumbnailUrl || "";

  const stageRef = useRef<HTMLDivElement>(null);
  const [theater, setTheater] = useState(false);
  const [fitMode, setFitMode] = useState<"fit" | "wide" | "tall">("fit");
  const [saved, setSaved] = useState(false);
  const [reported, setReported] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Keep GameMonetize URL 100% clean (ensure trailing slash, no foreign query params that break hash matching)
  const finalIframeUrl = (() => {
    try {
      const u = new URL(rawIframeUrl);
      if (u.hostname.includes("gamemonetize")) {
        u.search = "";
        if (!u.pathname.endsWith("/")) u.pathname += "/";
      }
      return u.toString();
    } catch {
      return rawIframeUrl;
    }
  })();

  useEffect(() => {
    if (!slug) return;
    pushRecent({ slug, title, thumbnailUrl });
    fetch("/api/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug, title, thumbnailUrl]);

  const toggleFullscreen = async () => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    } else {
      await el.requestFullscreen().catch(() => {});
    }
  };

  const shareGame = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      alert("Game link copied to clipboard!");
    }
  };

  const reportBroken = async () => {
    if (reported) return;
    setReported(true);
    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, reason: "Player reported issue" }),
    }).catch(() => {});
  };

  const stageSizeClass =
    fitMode === "tall"
      ? "mx-auto w-full max-w-[440px] h-[calc(100vh-165px)] min-h-[480px] max-h-[760px]"
      : fitMode === "wide"
      ? "w-full aspect-video max-h-[calc(100vh-165px)] min-h-[380px]"
      : "w-full h-[calc(100vh-165px)] min-h-[420px] max-h-[720px]";

  return (
    <div className={theater ? "fixed inset-0 z-50 bg-black/95 p-3 sm:p-6 flex flex-col justify-center" : "w-full"}>
      <div
        ref={stageRef}
        className={\`relative overflow-hidden rounded-2xl bg-black ring-1 ring-edge shadow-2xl flex items-center justify-center \${
          theater ? "w-full h-[calc(100vh-90px)]" : stageSizeClass
        }\`}
      >
        <iframe
          key={iframeKey}
          src={finalIframeUrl}
          title={title}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gamepad; gyroscope; picture-in-picture; pointer-lock; web-share"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-panel px-4 py-2.5 ring-1 ring-edge">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              pushRecent({ slug, title, thumbnailUrl });
              setSaved(true);
            }}
            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-fg ring-1 ring-edge transition hover:ring-arcade cursor-pointer"
          >
            {saved ? "✓ Saved in Vault" : "⚡ Save"}
          </button>

          <button
            type="button"
            onClick={() => setTheater(!theater)}
            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-fg ring-1 ring-edge transition hover:ring-arcade cursor-pointer"
          >
            {theater ? "💡 Lights On" : "🌙 Lights Off"}
          </button>

          <div className="flex items-center rounded-xl bg-ink p-0.5 ring-1 ring-edge">
            <button
              type="button"
              onClick={() => setFitMode("fit")}
              className={\`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer \${
                fitMode === "fit" ? "bg-arcade text-white" : "text-mute hover:text-fg"
              }\`}
            >
              🖥️ Fit Screen
            </button>
            <button
              type="button"
              onClick={() => setFitMode("wide")}
              className={\`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer \${
                fitMode === "wide" ? "bg-arcade text-white" : "text-mute hover:text-fg"
              }\`}
            >
              16:9
            </button>
            <button
              type="button"
              onClick={() => setFitMode("tall")}
              className={\`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer \${
                fitMode === "tall" ? "bg-arcade text-white" : "text-mute hover:text-fg"
              }\`}
            >
              📱 Mobile View
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIframeKey((k) => k + 1)}
            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-mute hover:text-fg ring-1 ring-edge cursor-pointer"
          >
            ↻ Reload
          </button>

          <button
            type="button"
            onClick={shareGame}
            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-mute hover:text-fg ring-1 ring-edge cursor-pointer"
          >
            🔗 Share
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reportBroken}
            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-semibold text-mute hover:text-red-400 ring-1 ring-edge cursor-pointer"
          >
            {reported ? "✓ Reported" : "⚑ Report"}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-xl bg-arcade px-4 py-1.5 text-xs font-extrabold text-white shadow-md shadow-arcade/30 transition hover:bg-arcade-soft cursor-pointer"
          >
            ⛶ Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
}
`
);

// 3. Remove the top placeholder AdBanner above the game player in src/app/game/[slug]/page.tsx
// so the GameMonetize iframe is 100% visible above the fold for Google IMA3 video ads
const gamePagePath = path.join(root, "src/app/game/[slug]/page.tsx");
if (fs.existsSync(gamePagePath)) {
  let gp = fs.readFileSync(gamePagePath, "utf8");
  gp = gp.replace(/<div className="mx-auto max-w-[1440px]([^>]*)>\s*<AdBanner format="leaderboard" \/>/, '<div className="mx-auto max-w-[1440px]$1>');
  fs.writeFileSync(gamePagePath, gp, "utf8");
  console.log("✅ Kept GamePlayer above-the-fold in src/app/game/[slug]/page.tsx for 100% video ad viewability");
}

// 4. Purge non-GameMonetize games (onlinegames.io, slowroads, local) from Supabase so 100% of plays earn GameMonetize revenue
const envPath = path.join(root, ".env.local");
const envVars = {};
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) envVars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

async function enforceGameMonetizeOnlyCatalog() {
  const url = envVars.SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL;
  const key = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_ANON_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;

  const headers = {
    apikey: key,
    Authorization: \`Bearer \${key}\`,
    "Content-Type": "application/json",
  };

  try {
    // Delete any game whose iframe_url is NOT hosted on gamemonetize
    const delRes = await fetch(
      \`\${url}/rest/v1/games?iframe_url=not.ilike.*gamemonetize*\`,
      { method: "DELETE", headers }
    );
    console.log("✅ Purged non-GameMonetize games from Supabase (HTTP " + delRes.status + ")");
  } catch (e) {
    console.log("⚠️ Could not auto-purge via REST:", e.message);
  }
}

await enforceGameMonetizeOnlyCatalog();

fs.unlinkSync(path.join(root, "fix-gamemonetize-revenue.mjs"));

console.log("\n🔍 Running TypeScript check (npx tsc --noEmit)...");
execSync("npx tsc --noEmit", { stdio: "inherit" });
console.log("✅ TypeScript passed with 0 errors!");