import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"

import { Cormorant_Garamond, DM_Sans, Bebas_Neue } from "next/font/google"
import QueryProvider from "./providers/query-provider"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300","400","600"],
  variable: "--font-cormorant"
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300","400","500"],
  variable: "--font-dm"
})

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas"
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "YashCart",
  description: "Modern ecommerce platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${bebas.variable}`}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors/>
        </QueryProvider>

      </body>
    </html>
  );
}