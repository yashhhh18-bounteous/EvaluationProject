export interface CarouselItem {
  title: string
  subtitle: string
  imageUrl: string
  ctaText: string
  ctaLink: string
}

export interface Product {
  id: number
  title: string
  price: number
  rating: number
  brand: string
  thumbnail: string
  category: string
  discountPercentage?: number
}