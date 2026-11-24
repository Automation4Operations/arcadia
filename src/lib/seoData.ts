// SEO trending keywords, quotes, tags & category metadata for Arcadia Games

export const TRENDING_KEYWORDS: string[] = [
  "free online games",
  "play games online no download",
  "unblocked games",
  "live multiplayer games",
  "latest trending browser games",
  "2 player online games",
  "3d webgl games",
  "instant browser games",
  "html5 games",
  "online games no sign up",
  "mobile games play free",
  "battle royale browser",
  "io games online",
  "shooting games online",
  "driving games browser",
  "puzzle games free",
  "arcade games online",
  "stickman games",
  "zombie games browser",
  "sports games online",
];

export const TRENDING_TAGS: { label: string; href: string; badge?: string }[] = [
  { label: "🔥 Trending Now", href: "/collection/trending-now", badge: "HOT" },
  { label: "⚡ Live Multiplayer", href: "/collection/multiplayer" },
  { label: "🌍 Latest Games", href: "/collection/latest-games", badge: "NEW" },
  { label: "🚫 Unblocked Hits", href: "/collection/unblocked-hits" },
  { label: "🧊 3D WebGL", href: "/collection/3d" },
  { label: "👥 2 Player", href: "/collection/2-player" },
  { label: "🧪 Sort Puzzles", href: "/collection/sort-puzzle" },
  { label: "🧟 Zombie Games", href: "/collection/zombie" },
  { label: "🔫 Shooting Arena", href: "/category/shooting" },
  { label: "🚗 Driving & Drift", href: "/category/driving" },
  { label: "⚔️ Action Games", href: "/category/action" },
  { label: "🧩 Puzzle Zone", href: "/category/puzzle" },
  { label: "🎯 .io Battles", href: "/category/io" },
  { label: "🏆 Top Picks", href: "/search?sort=top" },
];

export const TRENDING_QUOTES: { quote: string; tag: string; href: string }[] = [
  { quote: "No download. No sign-up. Just play.", tag: "Instant Play", href: "/" },
  { quote: "Drop into live battles with players worldwide.", tag: "Multiplayer", href: "/collection/multiplayer" },
  { quote: "The freshest HTML5 & 3D games, every week.", tag: "New Releases", href: "/collection/latest-games" },
  { quote: "Unblocked. Unlimited. Free.", tag: "Unblocked Games", href: "/collection/unblocked-hits" },
  { quote: "1 phone, 2 players, infinite fun.", tag: "2 Player", href: "/collection/2-player" },
];

export const RESTRUCTURED_CATEGORY_META: Record<
  string,
  { icon: string; tagline: string; trendingLine: string; keywords: string[] }
> = {
  shooting: {
    icon: "🔫",
    tagline: "Shoot your way to the top",
    trendingLine: "Trending: First-person shooters, sniper, tactical combat",
    keywords: ["shooting games online", "sniper games", "fps browser game", "gun games free"],
  },
  driving: {
    icon: "🚗",
    tagline: "Floor it. No speed limits.",
    trendingLine: "Trending: Drift racing, 3D driving, car parking",
    keywords: ["driving games online", "car games browser", "drift games free", "racing simulator"],
  },
  action: {
    icon: "⚔️",
    tagline: "Every second counts",
    trendingLine: "Trending: Platformers, fighting, battle royale",
    keywords: ["action games browser", "fighting games online", "battle royale html5", "adventure games free"],
  },
  stickman: {
    icon: "🥷",
    tagline: "Simple. Brutal. Brilliant.",
    trendingLine: "Trending: Stickman fighter, archer, ragdoll physics",
    keywords: ["stickman games", "stick fight online", "ragdoll physics game", "stickman archer"],
  },
  io: {
    icon: "🎯",
    tagline: "Enter the arena. Dominate.",
    trendingLine: "Trending: .io battle arena, snake io, agar.io style",
    keywords: ["io games", "play io games", "online .io battle", "snake io game"],
  },
  puzzle: {
    icon: "🧩",
    tagline: "Think. Solve. Win.",
    trendingLine: "Trending: Sort puzzle, block puzzle, brain teasers",
    keywords: ["puzzle games free", "brain games browser", "sort puzzle online", "block puzzle game"],
  },
  arcade: {
    icon: "🕹️",
    tagline: "Classic vibes. Modern browser.",
    trendingLine: "Trending: Pac-Man style, retro shooters, coin-op classics",
    keywords: ["arcade games online", "classic arcade browser", "retro games free", "coin-op html5"],
  },
  adventure: {
    icon: "🗺️",
    tagline: "Every click starts a new story",
    trendingLine: "Trending: RPG adventure, platformer, exploration",
    keywords: ["adventure games browser", "rpg online free", "platform games html5", "exploration game"],
  },
  simulation: {
    icon: "🏗️",
    tagline: "Build. Manage. Simulate.",
    trendingLine: "Trending: City builder, life sim, idle games",
    keywords: ["simulation games browser", "city builder online", "idle games free", "life simulation"],
  },
  sports: {
    icon: "⚽",
    tagline: "Play the game. Feel the crowd.",
    trendingLine: "Trending: Football, basketball, golf, table tennis",
    keywords: ["sports games online", "football browser game", "basketball game free", "golf game html5"],
  },
  board: {
    icon: "♟️",
    tagline: "Strategy meets fun",
    trendingLine: "Trending: Chess, Ludo, Checkers, Snake & Ladders",
    keywords: ["board games online", "chess browser game", "ludo online free", "checkers game"],
  },
  clicker: {
    icon: "👆",
    tagline: "One tap. Infinite rewards.",
    trendingLine: "Trending: Cookie clicker, idle clicker, tap games",
    keywords: ["clicker games free", "idle clicker browser", "tap games online", "cookie clicker style"],
  },
};
