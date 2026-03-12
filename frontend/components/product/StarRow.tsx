import { Star } from "lucide-react";

export default function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= Math.round(rating)
              ? "text-[#c8622a] fill-[#c8622a]"
              : "text-[#e8e3dd] fill-[#e8e3dd]"
          }
        />
      ))}
    </div>
  )
}