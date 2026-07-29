export default function Loading() {
  return (
    <div className="px-5 py-10">
      <div className="mx-auto mb-6 h-8 w-40 animate-pulse rounded-full bg-burgundy-900/70" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] animate-pulse rounded-2xl border border-burgundy-800/70 bg-burgundy-900/60"
          />
        ))}
      </div>
    </div>
  );
}
