import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma, RoleType } from './prisma.db';

const isPublicRoute = createRouteMatcher([
	'/',
	'/sign-in(.*)',
	'/sign-up(.*)',
	'/service(.*)',
	'/api/services(.*)',
	'/api/emails(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
	if (isAdminRoute(req)) {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.redirect(new URL('/sign-in', req.url));
		}

		// Check the role from our database (trusted source)
		try {
			const dbUser = await prisma.user.findUnique({
				where: { clerkUserId: userId },
			});
			if (
				!dbUser ||
				(dbUser.role !== RoleType.ADMIN && dbUser.role !== RoleType.SUPER_ADMIN)
			) {
				return NextResponse.redirect(new URL('/dashboard', req.url));
			}
		} catch {
			// If DB access fails, fall back to redirecting
			return NextResponse.redirect(new URL('/dashboard', req.url));
		}
	}

	const { userId, redirectToSignIn } = await auth();

	if (!userId && !isPublicRoute(req)) {
		return redirectToSignIn();
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
