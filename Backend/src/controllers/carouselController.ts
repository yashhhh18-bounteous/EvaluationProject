import { Request, Response } from "express"
import * as carouselService from "../services/carousel.services"

export const getCarousel = async (req: Request, res: Response) => {

  try {

    const banners = await carouselService.getCarousel()

    res.json({
      success:true,
      data:banners
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      success:false,
      message:"Failed to fetch carousel"
    })

  }

}