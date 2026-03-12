import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {

  console.log("Seeding carousel banners...");

  // Clear old banners (prevents duplicates)
  await prisma.carousel.deleteMany();

  await prisma.carousel.createMany({
    data: [
      {
        title: "Summer Sale",
        subtitle: "Up to 40% Off",
        imageUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f",
        ctaText: "Shop Now",
        ctaLink: "/products?category=laptops",
        position: 1
      },
      {
        title: "New Tech Arrivals",
        subtitle: "Latest gadgets just dropped",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        ctaText: "Explore",
        ctaLink: "/products?category=mobile-accessories",
        position: 2
      },
      {
        title: "Premium Furniture",
        subtitle: "Upgrade your living space",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        ctaText: "View Collection",
        ctaLink: "/products?category=furniture",
        position: 3
      },
      {
        title: "Top Rated Products",
        subtitle: "Customer favorites this week",
        imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
        ctaText: "See Best Sellers",
        ctaLink: "/products?sort=rating_desc",
        position: 4
      }
    ]
  });

  console.log("Carousel banners seeded successfully 🚀");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });