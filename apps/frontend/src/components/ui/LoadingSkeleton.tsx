export default function LoadingSkeleton() {
  return (
    <div className="card overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-video w-full skeleton rounded-xl mb-4" />

      {/* Title skeleton */}
      <div className="h-8 w-3/4 skeleton rounded-lg mb-2" />

      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-5/6 skeleton rounded" />
      </div>

      {/* Meta info skeleton */}
      <div className="flex gap-4 mb-6">
        <div className="h-5 w-20 skeleton rounded" />
        <div className="h-5 w-20 skeleton rounded" />
        <div className="h-5 w-20 skeleton rounded" />
      </div>

      {/* Ingredients skeleton */}
      <div className="mb-6">
        <div className="h-5 w-32 skeleton rounded mb-2" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-7 w-20 skeleton rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
