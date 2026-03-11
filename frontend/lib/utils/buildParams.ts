export interface BuildParamsArgs {
  page: number
  search: string
  category: string
  filters: {
    priceRange: [number, number]
    rating: number
    brands: string[]
    sort: string
  }
  filtersData: {
    priceRange: { min: number; max: number }
  } | null
}

export function buildParams({
  page,
  search,
  category,
  filters,
  filtersData,
}: BuildParamsArgs) {

  const params: Record<string, string> = {
    page: String(page),
    limit: "12",
  }

  if (search) params.search = search

  if (category) params.category = category

  if (filters.brands.length === 1) {
    params.brand = filters.brands[0]
  }

  if (filters.priceRange[0] > 0) {
    params.priceMin = String(filters.priceRange[0])
  }

  if (
    filtersData &&
    filters.priceRange[1] < Math.ceil(filtersData.priceRange.max)
  ) {
    params.priceMax = String(filters.priceRange[1])
  }

  if (filters.rating > 0) {
    params.rating = String(filters.rating)
  }

  if (filters.sort !== "default") {
    params.sort = filters.sort
  }

  return params
}