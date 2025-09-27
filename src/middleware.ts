import { getToken } from "next-auth/jwt"
import { NextResponse, NextRequest } from "next/server"

const secret = process.env.NEXTAUTH_SECRET

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === "/sign-in" || path === "/sign-up"
  const adminPath= path === "/adminDashboard" || path ==="/allAuthorData" || path ==="/allCustomerData" || path.startsWith("/bookDetails")
   || path==="/bookInventory" || path==="/singleAuthor"

  const authorPath= path==="/authorDashboard" || path==="/addNewBook" || path.startsWith("/books")

  const customerPath= path==="/customerDashboard" || path.startsWith("/bookOverview")
  // Get JWT token from cookies
  const token = await getToken({ req: request, secret })

  if (!token && isPublicPath) {
    return NextResponse.next()
  }
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  console.log("Token is",token)
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (isPublicPath && token.role==="ADMIN") {
    return NextResponse.redirect(new URL("/adminDashboard", request.url))
  }
  if (isPublicPath && token.role==="CUSTOMER") {
    return NextResponse.redirect(new URL("/customerDashboard", request.url))
  }
  if (isPublicPath && token.role==="AUTHOR") {
    return NextResponse.redirect(new URL("/authorDashboard", request.url))
  }
  if(token.role==="CUSTOMER" && (adminPath || authorPath)){
    return NextResponse.redirect(new URL("/customerDashboard", request.url))
  }
  if(token.role==="ADMIN" && (customerPath || authorPath)){
    return NextResponse.redirect(new URL("/adminDashboard", request.url))
  }
  if(token.role==="AUTHOR" && (adminPath || customerPath)){
    return NextResponse.redirect(new URL("/authorDashboard", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/about/:path*", "/sign-in", "/sign-up",
    //adminPath
    "/adminDashboard","/allCustomerData","/bookDetails/:path*","/bookInventory","/singleAuthor",
    //authorPath
    "/addNewBook","/authorDashboard","/books/:path*",
    //customerDashboard
    "/customerDashboard","/bookOverview/:path*"
  ],
}
