import {prisma} from "../lib/prisma"

export const getCarousel = async () => {

  const banners = await prisma.carousel.findMany({
    where:{
      isActive:true
    },
    orderBy:{
      position:"asc"
    }
  })

  return banners

}