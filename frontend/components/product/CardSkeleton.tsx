 import { Skeleton } from "@/components/ui/skeleton"
 
 
 export default function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#e8e3dd]">
      <Skeleton className="aspect-square w-full bg-[#f0ebe4]" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-2.5 w-16 bg-[#f0ebe4]" />
        <Skeleton className="h-4 w-full bg-[#f0ebe4]" />
        <Skeleton className="h-4 w-2/3 bg-[#f0ebe4]" />
        <Skeleton className="h-3 w-20 bg-[#f0ebe4]" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-5 w-16 bg-[#f0ebe4]" />
          <Skeleton className="h-8 w-8 rounded-xl bg-[#f0ebe4]" />
        </div>
      </div>
    </div>
  )
}
