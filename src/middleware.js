import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET
export async function middleware(request) {
    const url = request.nextUrl;
    const token = await getToken({ req: request, secret });

    if (token && url.pathname.startsWith('/login')) {

        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!token && (url.pathname.startsWith('/all-employees') || url.pathname.startsWith('/'))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/all-employees', '/'],
};
