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
  intro: string;
  updatedAt: string;
  categoryHref: string;
  categoryLabel: string;
  picks: GuidePick[];
  tips: string[];
};

export const GUIDES: GuideEntry[] = [
  {
    slug: "best-io-games",
    title: "Best .io Games to Play in Your Browser (2026)",
    seoTitle: "Best .io Games to Play in Your Browser (2026) | Arcadia Games",
    metaDescription:
      "Our picks of the best free .io multiplayer browser games in 2026 — instant arenas, zero downloads, tested on PC and mobile.",
    h1: "Best .io Games to Play in Your Browser (2026)",
    intro:
      "Fast-paced .io arena games let you jump straight into live multiplayer battles in seconds with zero downloads. Below are our top tested .io games on Arcadia Games across battle royale, survival, and arcade arenas.",
    updatedAt: "2026-11-27",
    categoryHref: "/category/io",
    categoryLabel: "Browse All .io Games",
    picks: [
      {
        title: "Yolk Ops Egg Arena",
        slug: "yolk-ops-egg-arena-86845",
        category: "Battle .io",
        summary: "Quick-match arena shooter with crisp movement and fast respawns.",
        bestFor: "Fast 3-minute arena rounds",
      },
      {
        title: "Munch Mob",
        slug: "munch-mob-83481",
        category: "Battle .io",
        summary: "Grow your squad across the map and outmaneuver rival swarms.",
        bestFor: "Classic grow-and-eat .io fans",
      },
      {
        title: "Monster Versus Human",
        slug: "monster-versus-human-86768",
        category: "Action / .io",
        summary: "Asymmetric survival rounds where teams outsmart or outrun each other.",
        bestFor: "Team survival rounds",
      },
      {
        title: "Stickman Legion",
        slug: "stickman-legion-86539",
        category: "Stickman / Arena",
        summary: "Build a stickman army and clash in quick browser skirmishes.",
        bestFor: "Strategy + action fans",
      },
    ],
    tips: [
      "Use full-screen mode on desktop for sharper mouse aim and fewer misclicks.",
      "Start around the edges of the arena before contesting the center.",
      "Play on a stable Wi-Fi or wired connection to minimize ping in live matches.",
    ],
  },
  {
    slug: "best-sort-puzzle-games",
    title: "Best Sort & Brain Puzzle Games Online (2026)",
    seoTitle: "Best Sort & Brain Puzzle Games Online (2026) | Arcadia Games",
    metaDescription:
      "Play the best free sort and brain puzzle games online — Fish Sort, Jewel Loop Color Sort, Thief Puzzle, and Maze Draw Path with no download.",
    h1: "Best Sort & Brain Puzzle Games Online (2026)",
    intro:
      "Sort and logic puzzles are ideal when you want a calm, satisfying brain workout without timers or heavy downloads. Every pick below runs smoothly in your browser on both phone touchscreens and desktop mice.",
    updatedAt: "2026-11-27",
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
        title: "Thief Puzzle",
        slug: "thief-puzzle-46896",
        category: "Brain Puzzle",
        summary: "Clever stretch-and-grab physics riddles with humorous scenarios.",
        bestFor: "Lateral thinking riddles",
      },
      {
        title: "Maze Draw Path",
        slug: "maze-draw-path-77237",
        category: "Logic Puzzle",
        summary: "Sketch clean routes through tricky obstacles in one continuous stroke.",
        bestFor: "Touch & mouse drawing puzzles",
      },
    ],
    tips: [
      "Keep at least one empty container or branch free before committing to a long chain.",
      "Work backward from blocked colors near the bottom of a stack.",
      "Use the restart button early if you lock a board—levels take seconds to replay.",
    ],
  },
  {
    slug: "best-3d-browser-games",
    title: "Best 3D WebGL Browser Games (2026)",
    seoTitle: "Best 3D WebGL Browser Games (2026) | Arcadia Games",
    metaDescription:
      "Explore top free 3D WebGL browser games on Arcadia Games — instant 3D racing, survival, and arcade action with zero installation.",
    h1: "Best 3D WebGL Browser Games (2026)",
    intro:
      "Modern WebGL brings smooth 3D graphics straight into Chrome, Edge, and Safari without installing gigabytes of files. Here are our top-performing 3D browser games that load fast and play cleanly.",
    updatedAt: "2026-11-27",
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
        title: "Wobble It",
        slug: "wobble-it-87655",
        category: "3D Physics",
        summary: "Balance and steer through playful 3D physics obstacle courses.",
        bestFor: "Lighthearted 3D challenges",
      },
      {
        title: "Master Chess Multiplayer",
        slug: "master-chess-multiplayer-640",
        category: "Board & Strategy",
        summary: "Clean board presentation with AI and multiplayer chess matches.",
        bestFor: "Classic strategy players",
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
  },
  {
    slug: "games-for-chromebook",
    title: "Best Browser Games for Chromebook (No Download)",
    seoTitle: "Best Browser Games for Chromebook (No Download) | Arcadia Games",
    metaDescription:
      "Free HTML5 browser games that run smoothly on Chromebook and low-end laptops — zero downloads, fast loading, keyboard and trackpad friendly.",
    h1: "Best Browser Games for Chromebook (No Download)",
    intro:
      "Chromebooks are built for the web, so lightweight HTML5 games are the best way to play without filling up storage or installing Android APKs. These picks load quickly on school or home Chromebooks.",
    updatedAt: "2026-11-27",
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
  },
];

export function getGuideBySlug(slug: string): GuideEntry | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
