import { NextResponse } from 'next/server';

export function middleware(request) {
  const session = request.cookies.get('admin_session');
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except the login page
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session || session.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};