import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_SESSION_COOKIE = 'admin_session';
const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_DASHBOARD_PATH = '/admin/dashboard';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get(ADMIN_SESSION_COOKIE)?.value === 'authenticated';
  const isLoginPage = pathname === ADMIN_LOGIN_PATH;

  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
