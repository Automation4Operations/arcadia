export type CategoryContent = {
  metaDescription: string;
  intro: string;
  about: string[];
};

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  shooting: {
    metaDescription:
      "Play free shooting games online: sniper missions, zombie survival, arena battles and space shooters. No download, instant play on PC and mobile.",
    intro:
      "Aim, fire and survive. From long-range sniper missions to zombie waves and arena battles, these shooting games load instantly in your browser.",
    about: [
      "Shooting games test your aim, reflexes and timing. Some are slow and tactical, like sniper games where wind and distance change every shot. Others are pure action, with enemies coming from every side and power-ups dropping as you fight.",
      "Most games here work with a mouse and keyboard on PC, and many support touch controls on phones and tablets. If you like playing with or against friends, check our multiplayer and 2-player collections too.",
    ],
  },
  driving: {
    metaDescription:
      "Play free driving and racing games online: car racing, drifting, parking, bikes, trucks and off-road. No download, instant play on PC and mobile.",
    intro:
      "Hit the gas. Race cars, drift through corners, park in tight spots or take a monster truck off-road, all free in your browser.",
    about: [
      "Driving games cover a lot of ground: fast street races, drift challenges, parking tests, dirt bike trails, taxi and delivery jobs, and stunt tracks full of ramps. Some reward pure speed, while others are all about careful control.",
      "Most driving games use the arrow keys or WASD on a keyboard, and many add on-screen pedals and steering for mobile. Start with a simple racer, then try a parking or off-road game when you want a tougher challenge.",
    ],
  },
  action: {
    metaDescription:
      "Play free action games online: fighting, brawlers, survival and boss battles. Fast, instant play in your browser on PC, phone and tablet.",
    intro:
      "Fast reflexes wanted. Fight, dodge and survive in action games packed with enemies, combos and boss battles.",
    about: [
      "Action games are about quick decisions and constant movement. You might be smashing through waves of enemies, dodging attacks in a reaction game or leveling up a hero between fights.",
      "Rounds are usually short, which makes these games great for a quick break. Many run on both desktop and mobile, so you can play on whatever device you have.",
    ],
  },
  stickman: {
    metaDescription:
      "Play free stickman games online: stickman fighting, shooting, parkour and army battles. No download, instant play on PC and mobile.",
    intro:
      "Simple stick figures, serious action. Fight, shoot, run and build stickman armies in these free browser games.",
    about: [
      "Stickman games keep the graphics simple so the gameplay can shine. You will find one-on-one fighters, ragdoll physics games, shooters, parkour runs and battles where your stickman army grows as you win.",
      "Because they are light, stickman games load fast and run smoothly even on older phones and laptops. Many have short levels, so it is easy to play just one more.",
    ],
  },
  io: {
    metaDescription:
      "Play free .io games online: arena battles, snake games and survival brawlers. Grow stronger and outlast your rivals. Instant play, no download.",
    intro:
      "Jump into an arena, grow stronger and outlast everyone else. These .io-style games are quick to start and hard to put down.",
    about: [
      "The .io style started with simple arena games where you begin small and grow by collecting points and defeating rivals. Today it includes snake games, top-down brawlers and survival battles.",
      "Rounds start in seconds with no sign-up. Most use the mouse or a single finger to move, so anyone can jump in, but smart movement is what keeps you alive.",
    ],
  },
  puzzle: {
    metaDescription:
      "Play free puzzle games online: match-3, sorting puzzles, logic and brain games. Relaxing, instant play on PC, phone and tablet.",
    intro:
      "Give your brain a workout. Match, sort, stack and solve your way through hundreds of free puzzle levels.",
    about: [
      "Puzzle games range from relaxing to really tricky. Match-3 and sorting games are great for winding down, while logic puzzles and physics challenges ask you to plan several moves ahead.",
      "Many puzzle games save your progress in your browser, so you can come back to the same level later. They work well with a mouse or touch, which makes them a great fit for phones and tablets.",
    ],
  },
  arcade: {
    metaDescription:
      "Play free arcade games online: endless runners, casual skill games and high-score challenges. Instant play on PC and mobile, no download.",
    intro:
      "Easy to learn, hard to master. Chase high scores in quick, colorful arcade games you can start in seconds.",
    about: [
      "Arcade games are built around simple controls and fast rounds. Endless runners, timing games and skill challenges all share the same goal: go a little further or score a little higher than last time.",
      "They are perfect for short breaks, and most work just as well on a phone as on a computer. Pick one, learn its rhythm and see how far you can push your best score.",
    ],
  },
  adventure: {
    metaDescription:
      "Play free adventure games online: runners, platformers, exploration and quest games. No download, instant play on PC, phone and tablet.",
    intro:
      "Explore new worlds, clear obstacles and reach the finish. Adventure games mix running, jumping and discovery.",
    about: [
      "Adventure games take you on a journey, whether that is a parkour race across rooftops, a platformer through strange worlds or a runner where every choice changes your hero.",
      "Most have many levels to unlock, along with coins, skins and upgrades to collect along the way. They support the keyboard on desktop and touch controls on mobile.",
    ],
  },
  simulation: {
    metaDescription:
      "Play free simulation games online: tycoon, shop, bakery, delivery and job simulators. Build and manage, instant play in your browser.",
    intro:
      "Run a shop, build a business or try a new job. Simulation games let you build something step by step.",
    about: [
      "Simulation games put you in charge. You might run a market, bake for customers, drive a delivery route or grow a small business into a tycoon empire.",
      "Many include idle features, so your business keeps earning while you plan the next upgrade. They reward patience and smart choices more than fast fingers.",
    ],
  },
  sports: {
    metaDescription:
      "Play free sports games online: football, ball games and sports challenges, solo or with a friend. Instant play on PC and mobile, no download.",
    intro:
      "Score goals, land trick shots and beat the clock. Play quick sports games in your browser, solo or with a friend.",
    about: [
      "Sports games turn real sports into quick, fun challenges. Some focus on skill shots, while others give you full matches against the computer or a friend.",
      "Controls are usually simple, often just a click, drag or tap. Look out for 2-player games you can play together on the same device.",
    ],
  },
  board: {
    metaDescription:
      "Play free strategy and board games online: classic board games, card games, mahjong and tactics. Think ahead, instant play in your browser.",
    intro:
      "Think before you move. Board games, card games and strategy challenges, all free to play online.",
    about: [
      "This category brings together slower, more thoughtful games. You will find board classics, card games, tile games and strategy challenges where planning matters more than speed.",
      "They are great for training your brain, and many let you play against the computer at your own pace. Most work with a mouse or a single tap.",
    ],
  },
  clicker: {
    metaDescription:
      "Play free clicker and idle games online: tap to earn, upgrade and grow. Relaxing incremental games, instant play on PC and mobile.",
    intro:
      "Tap, earn, upgrade, repeat. Watch small numbers turn into huge ones in these free clicker and idle games.",
    about: [
      "Clicker games start with a simple action, like tapping a button, and turn it into a growing empire. Every upgrade makes you earn faster, and soon your progress runs on its own.",
      "They are easy to play in short bursts and great for relaxing. Many save your progress in your browser, so your numbers keep growing between visits.",
    ],
  },
};
