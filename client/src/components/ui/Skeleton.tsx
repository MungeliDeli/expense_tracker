import { cn } from '../../lib/cn';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div className={cn('skeleton', className)} />
);

export const CardSkeleton = () => (
  <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-32" />
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex gap-4 p-4 border-b border-border">
    <Skeleton className="h-4 flex-1" />
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-4 flex-1" />
    <Skeleton className="h-4 w-24" />
  </div>
);
