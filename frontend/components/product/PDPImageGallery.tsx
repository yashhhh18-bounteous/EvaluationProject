"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

export default function PDPImageGallery({
  images,
  title,
  discountPercentage,
}: {
  images: string[]
  title: string
  discountPercentage: number
}) {

  const [activeImage,setActiveImage] = useState(0)
  const [wished,setWished] = useState(false)
  const [zoom,setZoom] = useState({x:50,y:50})

  const handleMove = (e:React.MouseEvent<HTMLDivElement>) => {

    const rect = e.currentTarget.getBoundingClientRect()

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setZoom({x,y})
  }

  return (

    <div className="space-y-4 lg:sticky lg:top-24">

      {/* Main Image */}
      <div
        onMouseMove={handleMove}
        className="relative aspect-square bg-white rounded-2xl border border-[#e8e3dd] overflow-hidden group"
      >

        <img
          src={images[activeImage]}
          alt={title}
          style={{
            transformOrigin:`${zoom.x}% ${zoom.y}%`
          }}
          className="w-full h-full object-contain p-8 transition-transform duration-300 group-hover:scale-150"
        />

        {/* Discount badge */}
        {discountPercentage > 5 && (
          <div className="absolute top-4 left-4 bg-[#c8622a] text-white text-xs font-medium px-3 py-1 rounded-full">
            -{Math.round(discountPercentage)}% OFF
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={()=>setWished(w=>!w)}
          className={`absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
            wished
              ? "bg-[#c8622a] text-white"
              : "bg-white text-[#8a7f78] hover:text-[#c8622a]"
          }`}
        >
          <Heart size={16} fill={wished ? "currentColor":"none"} />
        </button>

      </div>

      {/* Thumbnail Strip (WITHOUT thumbnail duplication) */}
      {images.slice(1).length > 0 && (

        <div className="flex gap-3 overflow-x-auto pb-1">

          {images.slice(1).map((img,i)=>{

            const index = i + 1

            return (

              <button
                key={index}
                onClick={()=>setActiveImage(index)}
                className={`flex-shrink-0 h-20 w-20 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                  activeImage === index
                    ? "border-[#c8622a] shadow-md shadow-[#c8622a]/20"
                    : "border-[#e8e3dd] hover:border-[#c8622a]/40"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-contain p-1.5"
                />
              </button>

            )

          })}

        </div>

      )}

    </div>

  )
}