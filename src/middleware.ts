import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('admin_session');
    const token = sessionCookie?.value;

    const isValid = await verifySessionToken(token);

    if (!isValid) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
