import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FiltersData, FilterState } from "@/types/filters"
import { Skeleton } from "@/components/ui/skeleton"




export default function FiltersSidebar({
  filtersData,
  filters,
  setFilters,
  onReset,
}: {
  filtersData: FiltersData | null
  filters: FilterState
  setFilters: (f: FilterState) => void
  onReset: () => void
}) {
  if (!filtersData) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24 bg-[#f0ebe4]" />
          <Skeleton className="h-8 w-full bg-[#f0ebe4]" />
        </div>
      ))}
    </div>
  )

  const toggleBrand = (brand: string) => {
    const brands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    setFilters({ ...filters, brands })
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium uppercase tracking-[0.18em] text-[#0a0a0f]/50"
        >
          Filters
        </span>
        <button
          onClick={onReset}
          className="text-[11px] text-[#c8622a] hover:underline underline-offset-4 font-light transition-all"
        >
          Reset all
        </button>
      </div>

      <Separator className="bg-[#e8e3dd]" />

      {/* Sort */}
      <div className="space-y-2.5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#0a0a0f]/50">Sort by</p>
        <Select value={filters.sort} onValueChange={(v) => setFilters({ ...filters, sort: v })}>
          <SelectTrigger className="h-9 rounded-xl border-[#e8e3dd] bg-[#faf7f3] text-sm font-light text-[#0a0a0f] focus:ring-[#c8622a]/20 focus:border-[#c8622a]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#e8e3dd]">
            {[
              { value: "default", label: "Relevance" },
              { value: "price_asc", label: "Price: Low → High" },
              { value: "price_desc", label: "Price: High → Low" },
              { value: "rating_desc", label: "Top Rated" },
            ].map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-sm font-light">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-[#e8e3dd]" />

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#0a0a0f]/50">Price Range</p>
          <span className="text-[11px] text-[#8a7f78] font-light">
            ${filters.priceRange[0]} – ${filters.priceRange[1]}
          </span>
        </div>
        <Slider
          min={Math.floor(filtersData.priceRange.min)}
          max={Math.ceil(filtersData.priceRange.max)}
          step={10}
          value={filters.priceRange}
          onValueChange={(v) => setFilters({ ...filters, priceRange: v as [number, number] })}
          className="[&>span:first-child]:bg-[#e8e3dd] [&_[role=slider]]:bg-[#c8622a] [&_[role=slider]]:border-[#c8622a] [&>span:first-child>span]:bg-[#c8622a]"
        />
        <div className="flex justify-between text-[10px] text-[#8a7f78] font-light">
          <span>${Math.floor(filtersData.priceRange.min)}</span>
          <span>${Math.ceil(filtersData.priceRange.max)}</span>
        </div>
      </div>

      <Separator className="bg-[#e8e3dd]" />

      {/* Rating */}
      <div className="space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#0a0a0f]/50">Min Rating</p>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => setFilters({ ...filters, rating: filters.rating === r ? 0 : r })}
              className={`flex-1 py-1.5 rounded-lg text-xs font-light border transition-all ${
                filters.rating === r
                  ? "bg-[#c8622a] text-white border-[#c8622a]"
                  : "border-[#e8e3dd] text-[#8a7f78] hover:border-[#c8622a]/40"
              }`}
            >
              {r}★
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-[#e8e3dd]" />

      {/* Brands */}
      <div className="space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#0a0a0f]/50">Brands</p>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
          {filtersData.brands.slice(0, 20).map((brand) => (
            <div key={brand} className="flex items-center gap-2.5">
              <Checkbox
                id={brand}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
                className="border-[#e8e3dd] data-[state=checked]:bg-[#c8622a] data-[state=checked]:border-[#c8622a] rounded-md h-4 w-4"
              />
              <Label
                htmlFor={brand}
                className="text-[13px] font-light text-[#0a0a0f]/70 cursor-pointer hover:text-[#0a0a0f] transition-colors"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
