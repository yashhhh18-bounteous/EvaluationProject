import {prisma} from "../lib/prisma"


interface ProductQuery {
  page: number
  limit: number
  category?: string
  brand?: string
  priceMin?: number
  priceMax?: number
  rating?: number
  search?: string
  sort?: string
}

export const getProducts = async ({
  page,
  limit,
  category,
  brand,
  priceMin,
  priceMax,
  rating,
  search,
  sort
}: ProductQuery) => {

  const skip = (page - 1) * limit

 const where: any = {}

if (category) {
  where.category = {
    slug: category
  }
}

if (brand) {
  where.brand = brand
}

if (priceMin !== undefined || priceMax !== undefined) {

  where.price = {}

  if (priceMin !== undefined) {
    where.price.gte = priceMin
  }

  if (priceMax !== undefined) {
    where.price.lte = priceMax
  }

}

if (rating !== undefined) {
  where.rating = {
    gte: rating
  }
}


if (search && search.length >= 2) {

  where.OR = [

    {
      title: {
        contains: search,
        mode: "insensitive"
      }
    },

    

    {
      brand: {
        contains: search,
        mode: "insensitive"
      }
    }

  ]

}

let orderBy: any = { createdAt: "desc" }
if (sort === "price_asc") {
  orderBy = { price: "asc" }
}

if (sort === "price_desc") {
  orderBy = { price: "desc" }
}

if (sort === "rating_desc") {
  orderBy = { rating: "desc" }
}

if (sort === "newest") {
  orderBy = { createdAt: "desc" }
}
  

  const [products, total] = await Promise.all([

prisma.product.findMany({
  where,
  skip,
  take: limit,
  orderBy,
  select:{
    id:true,
    title:true,
    price:true,
    rating:true,
    brand:true,
    thumbnail:true,
    category:{
      select:{ name:true }
    }
  }
}),

    prisma.product.count({ where })

  ])

  const pages = Math.ceil(total / limit)

  return {
    data: products,
    pagination:{
      page,
      limit,
      total,
      pages
    }
  }
}


export const getProductById = async (id: number) => {

  const product = await prisma.product.findUnique({

    where: { id },

    include: {

      category: true,

      images: true,

      reviews: {
        orderBy:{
          createdAt:"desc"
        }
      }

    }

  })

  return product

}

export const getCategories = async () => {

  const categories = await prisma.category.findMany({
    select:{
      id:true,
      name:true,
      slug:true
    },
    orderBy:{
      name:"asc"
    }
  })

  return categories

}


export const getFilters = async () => {

  const categories = await prisma.category.findMany({
    select:{
      id:true,
      name:true,
      slug:true
    }
  })

  const brands = await prisma.product.findMany({
    where:{
      brand:{
        not:null
      }
    },
    select:{
      brand:true
    },
    distinct:["brand"]
  })

  const priceRange = await prisma.product.aggregate({
    _min:{ price:true },
    _max:{ price:true }
  })

  return {
    categories,
    brands: brands.map(b => b.brand),
    priceRange:{
      min: priceRange._min.price,
      max: priceRange._max.price
    }
  }
}