import { Skeleton } from "../ui/skeleton";

export default function PDPSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-2xl bg-[#e8e3dd]" />
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-20 rounded-xl bg-[#e8e3dd]" />
          ))}
        </div>
      </div>
      <div className="space-y-5 pt-2">
        <Skeleton className="h-3 w-24 bg-[#e8e3dd]" />
        <Skeleton className="h-10 w-3/4 bg-[#e8e3dd]" />
        <Skeleton className="h-4 w-32 bg-[#e8e3dd]" />
        <Skeleton className="h-8 w-28 bg-[#e8e3dd]" />
        <Skeleton className="h-px w-full bg-[#e8e3dd]" />
        <Skeleton className="h-20 w-full bg-[#e8e3dd]" />
        <Skeleton className="h-12 w-full bg-[#e8e3dd]" />
        <Skeleton className="h-12 w-full bg-[#e8e3dd]" />
      </div>
    </div>
  )
}


