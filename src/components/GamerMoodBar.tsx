import Link from "next/link";

const MOODS = [
  {
    label: "BGMI / Battle Royale",
    sub: "Tactical & Squad FPS",
    icon: "🪂",
    href: "/search?category=shooting",
    accent: "from-orange-500/20 to-red-500/10 border-orange-500/40 hover:border-orange-400",
  },
  {
    label: "Dr. Driving & Parking",
    sub: "Highway & Drift Sim",
    icon: "🚗",
    href: "/search?category=driving",
    accent: "from-cyan-500/20 to-blue-500/10 border-cyan-500/40 hover:border-cyan-400",
  },
  {
    label: "Screw & Rope Physics",
    sub: "Nuts, Bolts & Logic",
    icon: "🔩",
    href: "/search?category=puzzle",
    accent: "from-yellow-500/20 to-amber-500/10 border-yellow-500/40 hover:border-yellow-400",
  },
  {
    label: "Chess Online & Ludo",
    sub: "Vs Friend & Multiplayer",
    icon: "♟️",
    href: "/search?category=multiplayer",
    accent: "from-emerald-500/20 to-green-500/10 border-emerald-500/40 hover:border-emerald-400",
  },
  {
    label: "Snake Eat & Grow",
    sub: "Slither & .io Arenas",
    icon: "🐍",
    href: "/search?category=io",
    accent: "from-purple-500/20 to-pink-500/10 border-purple-500/40 hover:border-purple-400",
  },
  {
    label: "Temple & Subway Run",
    sub: "3D Endless & Obby",
    icon: "🏃",
    href: "/search?category=adventure",
    accent: "from-indigo-500/20 to-violet-500/10 border-indigo-500/40 hover:border-indigo-400",
  },
  {
    label: "Candy Match & Merge",
    sub: "Crush, Sort & Blast",
    icon: "🍬",
    href: "/search?category=casual",
    accent: "from-pink-500/20 to-rose-500/10 border-pink-500/40 hover:border-pink-400",
  },
];

export default function GamerMoodBar() {
  return (
    <section aria-label="Quick Play Modes" className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 animate-ping rounded-full bg-sun" />
          <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-fg/90">
            Instant Gamer Modes — Pick Your Vibe
          </h2>
        </div>
        <span className="text-xs font-semibold text-mute hidden sm:inline">
          100% Free • Zero Downloads • Instant Browser Boot
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-7">
        {MOODS.map((m) => (
          <Link
            key={m.label}
            href={m.href}
            className={
              "group flex items-center gap-3 rounded-2xl border bg-gradient-to-br p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg " +
              m.accent
            }
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink/80 text-xl shadow-inner ring-1 ring-white/10 transition-transform group-hover:scale-110">
              {m.icon}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-xs font-extrabold text-white group-hover:text-sun">
                {m.label}
              </p>
              <p className="truncate text-[10px] font-medium text-fg/75">{m.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
