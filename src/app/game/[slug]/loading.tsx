export default function LoadingGame() {
  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 px-3 py-4 sm:px-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8 lg:py-6">
      <div className="min-w-0">
        <div className="mb-3 h-3 w-48 animate-pulse rounded bg-panel" />
        <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-4 rounded-2xl bg-panel ring-1 ring-edge sm:aspect-auto sm:h-[calc(100vh-140px)] sm:min-h-[460px] sm:max-h-[860px]">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-edge border-t-arcade" />
          <p className="font-display text-sm font-bold text-mute">Loading game…</p>
        </div>
        <div className="mt-3 h-12 w-full animate-pulse rounded-2xl bg-panel ring-1 ring-edge" />
        <div className="mt-6 h-9 w-72 animate-pulse rounded-lg bg-panel" />
        <div className="mt-3 flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-panel" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-panel" />
        </div>
      </div>

      <div className="grid grid-cols-2 content-start gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 p-1.5 lg:flex-row lg:items-center lg:gap-3">
            <div className="aspect-[4/3] w-full shrink-0 animate-pulse rounded-lg bg-panel ring-1 ring-edge lg:w-28" />
            <div className="w-full space-y-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-panel" />
              <div className="h-2.5 w-1/2 animate-pulse rounded bg-panel" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
