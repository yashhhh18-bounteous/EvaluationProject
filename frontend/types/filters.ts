export interface FiltersData {
  categories: string[]
  brands: string[]
  priceRange: {
    min: number
    max: number
  }
}

export interface FilterState {
  priceRange: [number, number]
  rating: number
  brands: string[]
  sort: string
}