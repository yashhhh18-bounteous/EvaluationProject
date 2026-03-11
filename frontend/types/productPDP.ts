export interface Review {
  id: number
  rating: number
  comment: string
  reviewerName: string
  createdAt: string
}

export interface ProductImage {
  id: number
  url: string
  productId: number
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  sku: string
  weight: number
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  returnPolicy: string
  minimumOrderQuantity: number
  tags: string[]
  thumbnail: string
  category: { id: number; name: string; slug: string }
  images: ProductImage[]
  reviews: Review[]
}