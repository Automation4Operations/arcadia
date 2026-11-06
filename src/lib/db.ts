import {
  getAllCategories,
  getCategorySections,
  getHeroSlides,
  getNewReleases,
  getTrending,
} from "@/lib/queries";

export async function getFeaturedGames(limit = 13) {
  const slides = await getHeroSlides();
  if (slides && slides.length > 0) return slides;
  return getTrending(limit);
}

export async function getFreshGames(limit = 12) {
  return getNewReleases(limit);
}

export async function getHomePageSections(gamesPerCategory = 13, maxCategories = 9) {
  return getCategorySections(gamesPerCategory, maxCategories);
}

export async function getCategories() {
  return getAllCategories();
}
