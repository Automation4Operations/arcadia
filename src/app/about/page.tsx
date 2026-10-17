export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-fg">
      <div className="rounded-2xl bg-panel p-8 ring-1 ring-edge shadow-2xl">
        <h1 className="font-display text-3xl font-extrabold text-arcade mb-4">About Arcadia Games</h1>
        <p className="text-sm text-mute leading-relaxed mb-6">
          Welcome to <strong className="text-fg">Arcadia Games (`arcadiagames.app`)</strong> — your ultimate destination for high-performance 3D WebGL, multiplayer mobile-style battle royales, and instant browser gaming. Built by gamers, for gamers.
        </p>

        <h2 className="font-display text-lg font-bold text-fg mt-6 mb-2">⚡ Authorized Creator Distribution</h2>
        <p className="text-sm text-mute leading-relaxed mb-6">
          All games hosted on Arcadia are powered by authorized developer distribution networks including GameMonetize and OnlineGames.io. Every title remains the intellectual property of its respective creators and publishers.
        </p>

        <h2 className="font-display text-lg font-bold text-fg mt-6 mb-2">🛡️ DMCA & Copyright Compliance</h2>
        <p className="text-sm text-mute leading-relaxed mb-4">
          We respect intellectual property rights. If you are a game developer or copyright owner and wish to have your content featured or removed, please contact our official compliance desk at:
        </p>
        <div className="inline-block rounded-xl bg-ink p-4 ring-1 ring-edge font-mono text-xs text-arcade">
          contact@arcadiagames.app
        </div>
      </div>
    </main>
  );
}