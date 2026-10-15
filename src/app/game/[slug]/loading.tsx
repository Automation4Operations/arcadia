export default function LoadingGame() {
  return (
    <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <div className="aspect-video w-full animate-pulse rounded-2xl bg-panel ring-1 ring-edge flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-edge border-t-sun" />
        </div>
        <div className="mt-6 h-8 w-64 animate-pulse rounded-lg bg-panel" />
        <div className="mt-3 h-4 w-40 animate-pulse rounded-lg bg-panel" />
      </div>
      <div className="grid grid-cols-2 gap-3 content-start">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[16/10] animate-pulse rounded-xl bg-panel ring-1 ring-edge" />
        ))}
      </div>
    </div>
  );
}
