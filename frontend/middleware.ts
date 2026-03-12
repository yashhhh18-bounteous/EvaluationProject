import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {

  const refreshToken = request.cookies.get("refreshToken")

  const { pathname } = request.nextUrl

  const publicRoutes = ["/login", "/signup"]

  const isPublic = publicRoutes.includes(pathname)

  // If user NOT logged in → block protected pages
  if (!refreshToken && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If user logged in → block login/signup
  if (refreshToken && isPublic) {
    return NextResponse.redirect(new URL("/explore", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/explore/:path*",
    "/products/:path*",
    "/cart/:path*",
    "/orders/:path*",
  ],
}