import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CarouselItem } from "@/types/product"

export default function HeroCarousel({ items }: { items: CarouselItem[] }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!items.length) return
    const t = setInterval(() => setActive((p) => (p + 1) % items.length), 4500)
    return () => clearInterval(t)
  }, [items.length])

  if (!items.length) return (
    <div className="h-52 rounded-2xl bg-[#1a1a22] animate-pulse" aria-label="Loading carousel" />
  )

  const item = items[active]

  return (
    <section
      aria-label="Featured items carousel"
      aria-roledescription="carousel"
      className="relative h-52 rounded-2xl overflow-hidden group"
    >

      {/* BG image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 will-change-transform"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
        role="img"
        aria-label={`Background image for ${item.title}`}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/90 via-[#0a0a0f]/50 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,rgba(5,150,105,0.15)_0%,transparent_70%)]" aria-hidden="true" />

      {/* Content */}
      <div
        className="relative z-10 h-full flex flex-col justify-center px-10 space-y-2"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#059669]">
          Featured
        </p>
        <h2
          className="text-4xl font-light text-[#f5f0eb] leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {item.title}
        </h2>
        <p className="text-sm font-light text-[#8a7f78]">{item.subtitle}</p>

        <Button
          size="sm"
          aria-label={`${item.ctaText} – ${item.title}`}
          className="mt-2 rounded-lg bg-[#059669] text-white border-0 text-xs font-medium tracking-wide w-fit cursor-default pointer-events-none"
          tabIndex={-1} 
        >
          {item.ctaText}
          <ChevronRight size={13} className="ml-1" aria-hidden="true" />
        </Button>
      </div>

      {/* Dots */}
      <div
        role="tablist"
        aria-label="Carousel slide indicators"
        className="absolute bottom-4 right-6 flex gap-1.5"
      >
        {items.map((slideItem, i) => (
          <button
            key={i}
            role="tab"
            aria-label={`Go to slide ${i + 1}: ${slideItem.title}`}
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-[#059669]" : "w-1.5 bg-[#f5f0eb]/30"
            }`}
          />
        ))}
      </div>

    </section>
  )
}