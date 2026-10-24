export default function Loading() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-16" aria-busy="true">
      <div className="nav-progress" />
      <div className="skeleton mt-4 h-12 rounded-2xl" />
      <div className="skeleton mt-4 h-[320px] rounded-[2rem]" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[16/10] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
