import { NextResponse } from 'next/server';

export function proxy(request) {
  const session = request.cookies.get('admin_session');
  const { pathname } = request.nextUrl;

  // 1. Protect all /admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session || session.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Already Logged In redirect
  if (pathname === '/admin/login' && session?.value === 'authenticated') {
    const dashboardUrl = new URL('/admin/dashboard', request.nextUrl.origin);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',          
    '/admin/:path*',   
  ],
};
