import { Skeleton } from "@/components/ui/skeleton";
export default function SkeletonSearch() {
  return (
    <div className="flex flex-col gap-3 w-4/12 min-w-sm mx-auto">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="flex gap-6 w-full items-center" key={index}>
          <Skeleton className="h-30 w-30 rounded-full" />
          <div className="space-y-2 w-6/12">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
