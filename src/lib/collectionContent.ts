export type CollectionContent = {
  metaDescription: string;
  about: string[];
};

export const COLLECTION_CONTENT: Record<string, CollectionContent> = {
  "3d": {
    metaDescription:
      "Shooters, driving, parkour and physics games in 3D. No download, no login.",
    about: [
      "3D games on Arcadia Games run directly in your browser, so there is nothing to install. Pick a game, press Play and you are in a full three-dimensional world within seconds, on a PC, laptop or most modern phones.",
      "You will find first-person shooters, driving and racing games, rooftop parkour, runners and physics sandboxes. Many support both keyboard and mouse on desktop and on-screen touch controls on mobile.",
      "If a game feels slow, close other browser tabs, try fullscreen mode from the game page and make sure your browser is up to date. Every game page lists its controls under How to play.",
    ],
  },
  "2-player": {
    metaDescription:
      "Duel, race and team up with a friend on one keyboard or one phone. No download needed.",
    about: [
      "2 player games let two people play on the same device, so you do not need an account, a second computer or an online lobby. Sit side by side, share the keyboard and play.",
      "This collection includes fighting and wrestling games, racing, sports and co-op challenges. On a keyboard, one player usually uses the arrow keys and the other uses W A S D. On a phone, the screen is often split so each player has one side.",
      "Check the How to play section on each game page to see the exact controls for Player 1 and Player 2. Many of these games also have a single-player mode if nobody is around.",
    ],
  },
  multiplayer: {
    metaDescription:
      "Play online against real people in shooters, .io arenas and more. No account needed.",
    about: [
      "Multiplayer games put you in a match with other real players over the internet. Choose a game, enter a nickname and join a live round, with no download and usually no account.",
      "The collection covers team shooters, battle-style games, .io arenas and online races. Player counts change through the day, so a game can be busier at some hours than others.",
      "For the best experience, use a stable connection and keep the game tab in the foreground. If a game cannot find enough players, try another one or come back later.",
    ],
  },
  zombie: {
    metaDescription:
      "Shoot, defend and survive against zombie hordes. Free in your browser.",
    about: [
      "Zombie games are about survival. You hold out against waves of the undead by shooting, building defenses or finding a way to escape, and each round gets harder than the last.",
      "This collection includes fast arcade shooters, tower defense, and tense 3D survival games. Collect better weapons, upgrade between rounds and watch your ammo and health.",
      "All of these games are free and run in your browser on desktop and most phones. Each game page lists its controls under How to play.",
    ],
  },
};
