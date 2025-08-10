import { Skeleton } from "@/components/ui/skeleton";
export default function SkeletonSearch() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-1.5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="flex items-center space-x-4" key={index}>
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
