import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ['/me', '/dashboard']
const authPaths = ['/login', '/register']
const productEditRegex = /^\/products\/\d+\/edit$/
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('sessionToken')?.value
  if(privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if(authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL('/me', request.url))
  }

  if(pathname.match(productEditRegex) && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/me', '/dashboard','/login', '/register', '/products/:path*'
  ],
}