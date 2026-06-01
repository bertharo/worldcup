export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-card bg-surface ${className}`}
      aria-hidden
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="surface-card space-y-3">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
