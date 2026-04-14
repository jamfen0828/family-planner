import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const session = request.cookies.get('fp_admin_session')?.value

  if (session === 'authenticated') {
    return NextResponse.next()
  }

  const loginUrl = new URL('/admin/login', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}