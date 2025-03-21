import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request) {
    const url = request.nextUrl;
    const token = await getToken({ req: request, secret });

    if (url.pathname.startsWith('/reset')) {
        return NextResponse.next();
    }

    if (!token && !url.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    else if (token) {
        const { role, isFormCompleted } = token;
        console.log(role);

        if (url.pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // User Routes
        if (role === 'user') {
            if (
                url.pathname === '/' ||
                url.pathname.startsWith('/employee/') ||
                url.pathname.startsWith('/birthday')
            ) {
                if (!isFormCompleted && url.pathname.startsWith('/employee/')) {
                    return NextResponse.redirect(new URL('/', request.url));
                }

                if (isFormCompleted && url.pathname === '/') {
                    return NextResponse.redirect(new URL(`/employee/${token.id}`, request.url));
                }

                return NextResponse.next();
            }


            return NextResponse.redirect(new URL('/', request.url));
        }


        // Admin Routes
        if (role === 'admin') { 
            if (url.pathname === '/track-expense') {
                return NextResponse.redirect(new URL('/', request.url));
            }

            if (!isFormCompleted) {
                if (url.pathname !== '/') {
                    return NextResponse.redirect(new URL('/', request.url));
                }
                return NextResponse.next();
            }

            if (isFormCompleted && url.pathname === '/') {
                return NextResponse.redirect(new URL(`/employee/${token.id}`, request.url));
            }

            return NextResponse.next();
        }

        // Super Admin Routes
        if (role === 'super_admin') { 
            return NextResponse.next();
        }



    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|api|favicon.ico).*)'],
};
