import { Skeleton } from "@/components/ui/skeleton";
export default function SkeletonSearch() {
  return (
    <div className="flex flex-col gap-3 mx-auto max-w-3xl w-[470px] p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="flex gap-3 items-center" key={index}>
          <Skeleton className="h-30 w-30 rounded-full" />
          <div className="space-y-2 w-4/6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
