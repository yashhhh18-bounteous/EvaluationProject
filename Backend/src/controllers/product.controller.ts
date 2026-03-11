import { Request, Response } from "express"
import * as productService from "../services/product.services"

export const getProducts = async (req: Request, res: Response) => {
  try {

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 12

    const category = req.query.category as string | undefined
    const brand = req.query.brand as string | undefined

    const priceMin = req.query.priceMin
      ? Number(req.query.priceMin)
      : undefined

    const priceMax = req.query.priceMax
      ? Number(req.query.priceMax)
      : undefined

    const rating = req.query.rating
      ? Number(req.query.rating)
      : undefined

    const search = req.query.search as string | undefined
    
    const sort = req.query.sort as string | undefined

    const result = await productService.getProducts({
  page,
  limit,
  category,
  brand,
  priceMin,
  priceMax,
  rating,
  search,
  sort
})

    res.json({
      success: true,
      ...result
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    })

  }
}

export const getProductById = async (req: Request, res: Response) => {

  try {

    const id = Number(req.params.id)

    const product = await productService.getProductById(id)

    if (!product) {
      return res.status(404).json({
        success:false,
        message:"Product not found"
      })
    }

    res.json({
      success:true,
      data: product
    })

  } catch (error) {

    res.status(500).json({
      success:false,
      message:"Failed to fetch product"
    })

  }

}

export const getCategories = async (req: Request, res: Response) => {

  try {

    const categories = await productService.getCategories()

    res.json({
      success: true,
      data: categories
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories"
    })

  }

}


export const getFilters = async (req: Request, res: Response) => {
console.log("Filters endpoint hit")
  try {

    const filters = await productService.getFilters()

    res.json({
      success:true,
      data:filters
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      success:false,
      message:"Failed to fetch filters"
    })

  }

}