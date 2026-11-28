export type GuidePick = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  bestFor: string;
};

export type GuideEntry = {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  quickSummary: string;
  intro: string;
  updatedAt: string;
  categoryHref: string;
  categoryLabel: string;
  picks: GuidePick[];
  tips: string[];
  faqs: { q: string; a: string }[];
};

export const GUIDES: GuideEntry[] = [
  {
    slug: "best-io-games",
    title: "Best .io Games to Play in Your Browser (2026)",
    seoTitle: "Best .io Games to Play in Your Browser (2026) | Arcadia Games",
    metaDescription:
      "Our picks of the best free .io multiplayer browser games in 2026 — instant arenas, zero downloads, tested on PC and mobile.",
    h1: "Best .io Games to Play in Your Browser (2026)",
    quickSummary:
      "The best free .io browser games on ArcadiaGames.app in 2026 are Slither Dragon.io, BattleDudes.io, Holecraft.io, and Yolk Ops Egg Arena. All run instantly in HTML5/WebGL with zero downloads on PC, Chromebook, and mobile.",
    intro:
      "Fast-paced .io arena games let you jump straight into live multiplayer battles in seconds with zero downloads. Below are our top tested .io games on Arcadia Games across battle royale, survival, and arcade arenas.",
    updatedAt: "2026-11-28",
    categoryHref: "/category/io",
    categoryLabel: "Browse All .io Games",
    picks: [
      {
        title: "Slither Dragon.io",
        slug: "slither-dragon-io-7929",
        category: "Battle .io",
        summary: "Collect glowing orbs, grow longer, and cut off rival dragons in a classic arena.",
        bestFor: "Slither-style arcade fans",
      },
      {
        title: "BattleDudes.io",
        slug: "battledudes-io-10057",
        category: "Battle .io",
        summary: "Top-down multiplayer shooter with destructible cover, vehicles, and quick respawns.",
        bestFor: "Fast 2D shooter squads",
      },
      {
        title: "Holecraft.io",
        slug: "holecraft-io-86362",
        category: "Battle .io",
        summary: "Swallow blocks and rival players to grow your black hole across voxel maps.",
        bestFor: "Hole-eating arena matches",
      },
      {
        title: "Yolk Ops Egg Arena",
        slug: "yolk-ops-egg-arena-86845",
        category: "Action / .io",
        summary: "Quick-match arena shooter with crisp movement and fast rounds.",
        bestFor: "3-minute arena sessions",
      },
    ],
    tips: [
      "Use full-screen mode on desktop for sharper mouse aim and fewer misclicks.",
      "Start around the edges of the arena before contesting the center.",
      "Play on a stable Wi-Fi or wired connection to minimize ping in live matches.",
    ],
    faqs: [
      {
        q: "Are .io games on Arcadia Games free to play?",
        a: "Yes, every .io game on ArcadiaGames.app is 100% free in your browser with no downloads or paid passes.",
      },
      {
        q: "Do .io games work on Chromebook and mobile?",
        a: "Yes — they run directly in Chrome, Safari, and Edge on desktop, Chromebook, and mobile touchscreens.",
      },
    ],
  },
  {
    slug: "best-sort-puzzle-games",
    title: "Best Sort & Brain Puzzle Games Online (2026)",
    seoTitle: "Best Sort & Brain Puzzle Games Online (2026) | Arcadia Games",
    metaDescription:
      "Play the best free sort and brain puzzle games online — Fish Sort, Jewel Loop Color Sort, Color Screw 3D, and Thief Puzzle with no download.",
    h1: "Best Sort & Brain Puzzle Games Online (2026)",
    quickSummary:
      "The best free sort and brain puzzle games to play online without downloading are Fish Sort Puzzle, Jewel Loop Color Sort, Color Screw 3D, and Thief Puzzle on ArcadiaGames.app. Each runs smoothly on desktop mice and mobile touchscreens.",
    intro:
      "Sort and logic puzzles are ideal when you want a calm, satisfying brain workout without timers or heavy downloads. Every pick below runs smoothly in your browser on both phone touchscreens and desktop mice.",
    updatedAt: "2026-11-28",
    categoryHref: "/category/puzzle",
    categoryLabel: "Browse All Puzzle Games",
    picks: [
      {
        title: "Fish Sort Puzzle",
        slug: "fish-sort-puzzle-86912",
        category: "Sort Puzzle",
        summary: "Group matching colorful fish onto clean branches with thoughtful move planning.",
        bestFor: "Relaxing color-sorting fans",
      },
      {
        title: "Jewel Loop Color Sort",
        slug: "jewel-loop-color-sort-87150",
        category: "Sort Puzzle",
        summary: "Vibrant gem-sorting challenges that gradually ramp up in complexity.",
        bestFor: "Quick logic breaks",
      },
      {
        title: "Color Screw 3D",
        slug: "color-screw-3d-76426",
        category: "3D Sort Puzzle",
        summary: "Rotate 3D structures, unscrew colorful bolts, and sort them into matching boxes.",
        bestFor: "Tactile 3D spatial puzzles",
      },
      {
        title: "Thief Puzzle",
        slug: "thief-puzzle-46896",
        category: "Brain Puzzle",
        summary: "Clever stretch-and-grab physics riddles with humorous scenarios.",
        bestFor: "Lateral thinking riddles",
      },
    ],
    tips: [
      "Keep at least one empty container or branch free before committing to a long chain.",
      "Work backward from blocked colors near the bottom of a stack.",
      "Use the restart button early if you lock a board — levels take seconds to replay.",
    ],
    faqs: [
      {
        q: "Can I play sort puzzle games on my phone without an app?",
        a: "Yes — Fish Sort Puzzle, Jewel Loop Color Sort, and Color Screw 3D play directly in mobile Chrome or Safari.",
      },
      {
        q: "Do these brain puzzles save progress?",
        a: "Yes, progress saves locally in your browser, and free Cloud Save syncs your XP across devices.",
      },
    ],
  },
  {
    slug: "best-3d-browser-games",
    title: "Best 3D WebGL Browser Games (2026)",
    seoTitle: "Best 3D WebGL Browser Games (2026) | Arcadia Games",
    metaDescription:
      "Explore top free 3D WebGL browser games on Arcadia Games — instant 3D racing, survival, and arcade action with zero installation.",
    h1: "Best 3D WebGL Browser Games (2026)",
    quickSummary:
      "Top free 3D WebGL browser games on ArcadiaGames.app include Snow Rush 3D, Color Screw 3D, Wobble It, and Rooftop Shooters. They load directly in Chrome, Edge, and Safari with zero installation.",
    intro:
      "Modern WebGL brings smooth 3D graphics straight into Chrome, Edge, and Safari without installing gigabytes of files. Here are our top-performing 3D browser games that load fast and play cleanly.",
    updatedAt: "2026-11-28",
    categoryHref: "/collection/3d",
    categoryLabel: "Browse All 3D Games",
    picks: [
      {
        title: "Snow Rush 3D",
        slug: "snow-rush-3d-86037",
        category: "3D Arcade / Racing",
        summary: "High-speed downhill sledding through pine trees, ramps, and icy hazards.",
        bestFor: "Fast reflex runs",
      },
      {
        title: "Color Screw 3D",
        slug: "color-screw-3d-76426",
        category: "3D Puzzle",
        summary: "360-degree rotating mechanical bolt-sorting challenges with realistic physics.",
        bestFor: "3D puzzle solvers",
      },
      {
        title: "Wobble It",
        slug: "wobble-it-87655",
        category: "3D Physics",
        summary: "Balance and steer through playful 3D physics obstacle courses.",
        bestFor: "Lighthearted 3D challenges",
      },
      {
        title: "Rooftop Shooters",
        slug: "rooftop-shooters-661",
        category: "Action / 2-Player",
        summary: "Physics-driven rooftop duels great for solo or same-keyboard 2-player fun.",
        bestFor: "2-player local matches",
      },
    ],
    tips: [
      "Enable hardware acceleration in your browser settings for the smoothest 60fps WebGL frame rate.",
      "Close unused heavy video tabs while playing 3D games on laptops.",
    ],
    faqs: [
      {
        q: "Do 3D WebGL games need a gaming PC?",
        a: "No — most WebGL games on Arcadia Games run smoothly on integrated laptop graphics and modern phones.",
      },
      {
        q: "Are 3D games free to play?",
        a: "Yes, all 3D WebGL titles on ArcadiaGames.app are free with no downloads.",
      },
    ],
  },
  {
    slug: "games-for-chromebook",
    title: "Best Browser Games for Chromebook (No Download)",
    seoTitle: "Best Browser Games for Chromebook (No Download) | Arcadia Games",
    metaDescription:
      "Free HTML5 browser games that run smoothly on Chromebook and low-end laptops — zero downloads, fast loading, keyboard and trackpad friendly.",
    h1: "Best Browser Games for Chromebook (No Download)",
    quickSummary:
      "The best free HTML5 games that run smoothly on Chromebook with zero downloads are Protect My Dog, Tidy Bot, Prison Escape, and Stickman Kombat 2D on ArcadiaGames.app. They require no Play Store apps and run cleanly on 4GB RAM laptops.",
    intro:
      "Chromebooks are built for the web, so lightweight HTML5 games are the best way to play without filling up storage or installing Android APKs. These picks load quickly on school or home Chromebooks.",
    updatedAt: "2026-11-28",
    categoryHref: "/collection/unblocked-hits",
    categoryLabel: "Browse Chromebook Collection",
    picks: [
      {
        title: "Protect My Dog",
        slug: "protect-my-dog-38346",
        category: "Puzzle",
        summary: "Draw quick protective barriers with a trackpad or touchscreen.",
        bestFor: "Trackpad & touch play",
      },
      {
        title: "Tidy Bot",
        slug: "tidy-bot-87701",
        category: "Puzzle / Casual",
        summary: "Lightweight sorting and organizing levels with zero lag.",
        bestFor: "Low-RAM Chromebooks",
      },
      {
        title: "Prison Escape",
        slug: "prison-escape-53456",
        category: "Adventure",
        summary: "Stealth and timing puzzles that run smoothly in any Chrome tab.",
        bestFor: "Quick 5-minute breaks",
      },
      {
        title: "Stickman Kombat 2D",
        slug: "stickman-kombat-2d-88268",
        category: "Stickman / Action",
        summary: "Crisp 2D keyboard combat that doesn't require a dedicated GPU.",
        bestFor: "Keyboard action",
      },
    ],
    tips: [
      "Use keyboard arrow keys or WASD for action games instead of the Chromebook trackpad.",
      "Sign in with Cloud Save on Arcadia Games to keep your XP and progress across devices.",
    ],
    faqs: [
      {
        q: "Do these games work on school or 4GB RAM Chromebooks?",
        a: "Yes — lightweight HTML5 games load in Chrome without Android APK installs or heavy GPU requirements.",
      },
      {
        q: "Can I use a Chromebook trackpad?",
        a: "Yes! Puzzle and drawing games like Protect My Dog and Fish Sort Puzzle are great with a trackpad.",
      },
    ],
  },
  {
    slug: "games-like-fish-sort-puzzle",
    title: "Best Games Like Fish Sort Puzzle Online (2026)",
    seoTitle: "Best Games Like Fish Sort Puzzle Online (2026) | Arcadia Games",
    metaDescription:
      "Love Fish Sort Puzzle? Play free browser games like Fish Sort Puzzle — Jewel Loop Color Sort, Color Screw 3D, Dream Room, and Candy Match Pop with no download.",
    h1: "Best Games Like Fish Sort Puzzle to Play Online",
    quickSummary:
      "If you enjoy Fish Sort Puzzle, the closest free browser games on ArcadiaGames.app are Jewel Loop Color Sort, Color Screw 3D, Dream Room: Arrangement of Objects, and Candy Match Pop — all offering calm, no-timer sorting and matching in your browser.",
    intro:
      "Fish Sort Puzzle is one of the most popular relaxing sorting games on Arcadia Games. If you finished your favorite levels and want more satisfying color-matching and organizing puzzles, these tested browser games deliver the same calm brain challenge with zero downloads.",
    updatedAt: "2026-11-28",
    categoryHref: "/collection/sort-puzzle",
    categoryLabel: "Browse All Sort Puzzles",
    picks: [
      {
        title: "Fish Sort Puzzle",
        slug: "fish-sort-puzzle-86912",
        category: "Sort Puzzle",
        summary: "The original favorite — group matching fish onto clean branches with smart move planning.",
        bestFor: "Classic fish & color sorting",
      },
      {
        title: "Jewel Loop Color Sort",
        slug: "jewel-loop-color-sort-87150",
        category: "Sort Puzzle",
        summary: "Fast, colorful gem sorting that feels immediately familiar to Fish Sort players.",
        bestFor: "Direct Fish Sort alternative",
      },
      {
        title: "Color Screw 3D",
        slug: "color-screw-3d-76426",
        category: "3D Sort Puzzle",
        summary: "Unscrew matching colored bolts into 3-slot trays with tactile 3D physics.",
        bestFor: "3D sorting fans",
      },
      {
        title: "Dream Room: Arrangement of Objects",
        slug: "dream-room-arrangement-of-objects-88556",
        category: "Organizing Puzzle",
        summary: "Cozy room-tidying puzzle where every piece of furniture snaps neatly into place.",
        bestFor: "Stress-free organizing",
      },
    ],
    tips: [
      "Always leave at least one empty slot or branch open as a temporary buffer.",
      "Prioritize freeing colors trapped at the bottom of tall stacks first.",
      "Play in Fullscreen on mobile or desktop for easier tap targets.",
    ],
    faqs: [
      {
        q: "Are there games like Fish Sort Puzzle with no download?",
        a: "Yes — Jewel Loop Color Sort and Color Screw 3D play directly in your browser on ArcadiaGames.app with zero downloads.",
      },
      {
        q: "Is Fish Sort Puzzle free on mobile?",
        a: "Yes, it runs in mobile Chrome and Safari without installing an app.",
      },
    ],
  },
  {
    slug: "games-like-hole-io",
    title: "Best Games Like Hole.io to Play in Browser (2026)",
    seoTitle: "Best Games Like Hole.io to Play in Browser (2026) | Arcadia Games",
    metaDescription:
      "Play free browser games like Hole.io on Arcadia Games — Hole Io 2, Holecraft.io, Super Tornado.io, and Slither Dragon.io with instant multiplayer action.",
    h1: "Best Games Like Hole.io to Play in Your Browser",
    quickSummary:
      "The best free browser games like Hole.io on ArcadiaGames.app are Hole Io 2, Holecraft.io, Super Tornado.io - Tornado Rush, and Slither Dragon.io. Jump into instant eat-and-grow arenas with zero downloads.",
    intro:
      "Eat-and-grow .io games combine simple movement with huge late-game payoffs as you swallow larger objects and rival players. Here are the best Hole.io-style games you can launch right now in your browser.",
    updatedAt: "2026-11-28",
    categoryHref: "/category/io",
    categoryLabel: "Browse All .io Games",
    picks: [
      {
        title: "Hole Io 2",
        slug: "hole-io-2-56057",
        category: "Battle .io",
        summary: "Classic black-hole devouring action where every object swallowed expands your size.",
        bestFor: "Pure Hole.io gameplay",
      },
      {
        title: "Holecraft.io",
        slug: "holecraft-io-86362",
        category: "Battle .io",
        summary: "Voxel-style black hole arena with fast growth loops and rival chases.",
        bestFor: "Block-world hole battles",
      },
      {
        title: "Super Tornado.io - Tornado Rush",
        slug: "super-tornado-io-tornado-rush-21091",
        category: "Battle .io",
        summary: "Sweep up cities, trees, and smaller storms as a growing tornado.",
        bestFor: "Destruction & growth fans",
      },
      {
        title: "Slither Dragon.io",
        slug: "slither-dragon-io-7929",
        category: "Battle .io",
        summary: "Outmaneuver rival dragons to absorb their loot and climb the leaderboard.",
        bestFor: "Classic .io leaderboard chases",
      },
    ],
    tips: [
      "Stick to clusters of small items in the first 20 seconds to scale up quickly.",
      "Avoid bigger holes early — use corners and tight alleys to escape.",
    ],
    faqs: [
      {
        q: "Can I play Hole.io style games without downloading an app?",
        a: "Yes — Hole Io 2, Holecraft.io, and Super Tornado.io run instantly in your browser on ArcadiaGames.app.",
      },
      {
        q: "Do these games work on PC and mobile?",
        a: "Yes, you can steer with your mouse on PC or touch-drag on mobile.",
      },
    ],
  },
  {
    slug: "best-2-player-browser-games",
    title: "Best 2 Player Browser Games on One Keyboard (2026)",
    seoTitle: "Best 2 Player Browser Games on One Keyboard (2026) | Arcadia Games",
    metaDescription:
      "Play free 2 player browser games with a friend on one keyboard or online — Rooftop Shooters, Tennis Master, Master Chess Multiplayer, and Steal Car Duel.",
    h1: "Best 2 Player Browser Games to Play With a Friend",
    quickSummary:
      "The best free 2 player browser games on ArcadiaGames.app are Rooftop Shooters, Tennis Master, Master Chess Multiplayer, and Steal Car Duel. Share one keyboard on a laptop or challenge opponents online with zero downloads.",
    intro:
      "Sharing one keyboard or facing off in a quick 1v1 match is one of the fastest ways to have fun with a friend in Chrome. These 2-player games run smoothly on laptops, desktops, and Chromebooks with zero setup.",
    updatedAt: "2026-11-28",
    categoryHref: "/collection/2-player",
    categoryLabel: "Browse All 2-Player Games",
    picks: [
      {
        title: "Rooftop Shooters",
        slug: "rooftop-shooters-661",
        category: "2-Player Action",
        summary: "Chaotic ragdoll physics duels on one keyboard — knock your friend off the roof first.",
        bestFor: "Same-keyboard laughs",
      },
      {
        title: "Tennis Master",
        slug: "tennis-master-17807",
        category: "2-Player Sports",
        summary: "Fast 1v1 arcade tennis rallies with power shots and local 2-player mode.",
        bestFor: "Quick sports 1v1s",
      },
      {
        title: "Master Chess Multiplayer",
        slug: "master-chess-multiplayer-640",
        category: "Board & Strategy",
        summary: "Play pass-and-play local chess or challenge online opponents.",
        bestFor: "Classic 2-player strategy",
      },
      {
        title: "Steal Car Duel",
        slug: "steal-car-duel-38376",
        category: "2-Player Driving",
        summary: "Head-to-head car arena challenges built for competitive two-player sessions.",
        bestFor: "Competitive driving duels",
      },
    ],
    tips: [
      "Use a full-size laptop or external keyboard so both players have comfortable key spacing.",
      "Press Fullscreen inside the Arcadia player before starting a local 2-player match.",
    ],
    faqs: [
      {
        q: "Can two people play on the same laptop?",
        a: "Yes — games like Rooftop Shooters and Tennis Master support two players sharing one keyboard.",
      },
      {
        q: "Do both players need an account?",
        a: "No! You can start a 2-player match immediately with zero sign-up.",
      },
    ],
  },
  {
    slug: "best-free-chess-and-board-games",
    title: "Best Free Chess & Classic Board Games Online (2026)",
    seoTitle: "Best Free Chess & Classic Board Games Online (2026) | Arcadia Games",
    metaDescription:
      "Play free chess and classic board games online at Arcadia Games — Master Chess Multiplayer, Reversi, Dots and Boxes, and Solitaire Spider & Klondike.",
    h1: "Best Free Chess & Classic Board Games Online",
    quickSummary:
      "The best free chess and classic board games on ArcadiaGames.app are Master Chess Multiplayer, Reversi, Dots and Boxes, and Solitaire: Spider and Klondike. Play solo against AI or with a friend with zero downloads or sign-ups.",
    intro:
      "Classic board and card games never go out of style when you want pure strategy in a clean browser tab. Whether you want a 10-minute chess match or relaxing solitaire, these picks load instantly on PC and mobile.",
    updatedAt: "2026-11-28",
    categoryHref: "/category/board",
    categoryLabel: "Browse All Board & Strategy Games",
    picks: [
      {
        title: "Master Chess Multiplayer",
        slug: "master-chess-multiplayer-640",
        category: "Chess / Strategy",
        summary: "Play online multiplayer, pass-and-play local matches, or practice against AI.",
        bestFor: "Online & 2-player chess",
      },
      {
        title: "Reversi",
        slug: "reversi-839",
        category: "Board Strategy",
        summary: "Classic Othello-style tile-flipping strategy where corner control wins the board.",
        bestFor: "Quick tactical matches",
      },
      {
        title: "Dots and Boxes",
        slug: "dots-and-boxes-27993",
        category: "Classic Paper Board",
        summary: "Connect lines to claim boxes and chain combos against smart opponents.",
        bestFor: "Nostalgic 5-minute strategy",
      },
      {
        title: "Solitaire: Spider and Klondike",
        slug: "solitaire-spider-and-klondike-48230",
        category: "Card / Board",
        summary: "Both Spider (1, 2, and 4 suits) and classic Klondike Solitaire in one clean game.",
        bestFor: "Solo card strategy",
      },
    ],
    tips: [
      "In Chess, develop knights and bishops toward the center before pushing flank pawns.",
      "In Reversi, prioritize capturing the four corners — they can never be flipped back.",
    ],
    faqs: [
      {
        q: "Can I play chess online free without creating an account?",
        a: "Yes — Master Chess Multiplayer launches directly in your browser on ArcadiaGames.app with no registration.",
      },
      {
        q: "What classic board games are available?",
        a: "Alongside Chess, you can play Reversi, Dots and Boxes, Snakes and Ladders, Domino Online, and Solitaire.",
      },
    ],
  },
];

export function getGuideBySlug(slug: string): GuideEntry | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
