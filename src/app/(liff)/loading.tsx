export default function LiffLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero skeleton */}
      <div className="h-72 bg-slate-200 sm:h-96" />

      {/* Content skeleton */}
      <div className="px-4 py-6 space-y-6">
        {/* Price card */}
        <div className="h-20 rounded-xl bg-slate-200" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="h-24 rounded-xl bg-slate-200" />
          <div className="h-24 rounded-xl bg-slate-200" />
          <div className="h-24 rounded-xl bg-slate-200" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-6 w-32 rounded bg-slate-200" />
          <div className="h-4 rounded bg-slate-200" />
          <div className="h-4 w-3/4 rounded bg-slate-200" />
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <div className="h-6 w-40 rounded bg-slate-200" />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 rounded-lg bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
