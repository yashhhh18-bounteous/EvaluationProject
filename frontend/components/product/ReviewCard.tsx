import { Review } from "@/types/productPDP"
import StarRow from "./StarRow"
import { User } from "lucide-react"


export default function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e8e3dd] space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#c8622a]/10 border border-[#c8622a]/20 flex items-center justify-center text-[#c8622a]">
            <User size={15} />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#0a0a0f]">{review.reviewerName}</p>
            <p className="text-[11px] text-[#8a7f78] font-light">{date}</p>
          </div>
        </div>
        <StarRow rating={review.rating} size={12} />
      </div>
      <p className="text-[13px] font-light text-[#0a0a0f]/70 leading-relaxed">
        {review.comment}
      </p>
    </div>
  )
}