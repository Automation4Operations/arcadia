// Deterministic seeded stats & reviews — always consistent, always under 1000

export type SeededGameStats = {
  plays: number;
  likes: number;
  reviewCount: number;
  ratingAvg: number;
};

export type SeededReview = {
  id: string;
  kind: "comment";
  name: string;
  body: string;
  rating: number;
  created_at: string;
};

/** Fast 32-bit hash of a string */
function hash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h;
}

/** Seeded pseudo-random float [0,1) */
function seeded(seed: number): number {
  seed = (seed ^ (seed >>> 16)) >>> 0;
  seed = Math.imul(seed, 0x45d9f3b) >>> 0;
  seed = (seed ^ (seed >>> 16)) >>> 0;
  return seed / 0x100000000;
}

/** Seeded int in [min, max] */
function rng(slug: string, salt: string, min: number, max: number): number {
  const r = seeded(hash(slug + salt));
  return Math.round(min + r * (max - min));
}

/** Returns realistic stats for any game, deterministically, all under 1000 */
export function getSeededGameStats(
  slug: string,
  realPlays = 0,
  realRating = 0
): SeededGameStats {
  const plays = rng(slug, "plays", 118, 976);
  const likes = rng(slug, "likes", 104, 933);
  const reviewCount = rng(slug, "reviews", 101, 864);
  const rawRating = 4.3 + seeded(hash(slug + "rating")) * 0.6; // 4.3–4.9
  const ratingAvg = realRating > 0 ? Math.min(4.9, Math.max(4.3, realRating)) : Math.round(rawRating * 10) / 10;

  void realPlays; // We show seeded plays to keep all games consistent under 1000
  return { plays, likes, reviewCount, ratingAvg };
}

const GAMER_NAMES = [
  "XBlasterZ", "NeonRacer99", "GlitchKing", "PixelPwner", "DriftMaster",
  "CyberDave", "ZeroLagLucy", "SniperMike", "TurboTina", "LagSlayer",
  "ArcadePhoenix", "GridRunner", "NitroJack", "StealthFox", "ChillGamer92",
  "RocketAce", "JoypadQueen", "BitCrusher", "ShadowRift", "PulsarBoy",
];

const REVIEW_TEMPLATES = [
  (t: string) => `${t} is genuinely addictive. I kept coming back for one more round.`,
  (t: string) => `Super smooth gameplay on ${t}. No lag at all even on my phone.`,
  (t: string, c?: string) => `Best ${c ?? "game"} on this site. ${t} never gets old.`,
  (t: string) => `Played ${t} for two hours straight without noticing. That says it all.`,
  (t: string) => `${t} has some of the most satisfying mechanics I've seen in a browser game.`,
  (t: string) => `My whole family loves ${t}. Even my parents wanted a turn!`,
  (t: string, c?: string) => `If you like ${c ?? "action games"}, ${t} is a must-play.`,
  (t: string) => `Just discovered ${t} and already recommended it to five friends.`,
  (t: string) => `The controls on ${t} are super tight. No complaints at all.`,
  (t: string) => `${t} loads instantly and runs perfectly. Love this site!`,
];

/** Returns 4–6 deterministic natural-sounding player reviews */
export function getSeededReviews(
  slug: string,
  title: string,
  category?: string
): SeededReview[] {
  const count = rng(slug, "review_count", 4, 6);
  const now = Date.now();
  const reviews: SeededReview[] = [];

  for (let i = 0; i < count; i++) {
    const salt = `review_${i}`;
    const nameIdx = rng(slug, salt + "_name", 0, GAMER_NAMES.length - 1);
    const templateIdx = rng(slug, salt + "_tpl", 0, REVIEW_TEMPLATES.length - 1);
    const daysAgo = rng(slug, salt + "_days", 1, 30);
    const rating = rng(slug, salt + "_rating", 4, 5);

    reviews.push({
      id: `seed_${slug}_${i}`,
      kind: "comment",
      name: GAMER_NAMES[nameIdx],
      body: REVIEW_TEMPLATES[templateIdx](title, category),
      rating,
      created_at: new Date(now - daysAgo * 86400000).toISOString(),
    });
  }

  return reviews;
}
