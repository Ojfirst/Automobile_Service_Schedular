import {
	clerkMiddleware,
	createRouteMatcher,
	clerkClient,
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

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
		const { userId, sessionClaims } = await auth();

		if (!userId) {
			return NextResponse.redirect(new URL('/sign-in', req.url));
		}

		// Prefer checking the user's public metadata (more reliable)
		try {
			let clerkUser = null;
			if (userId) {
				const client = await clerkClient();
				clerkUser = await client.users.getUser(userId);
			}
			const role =
				clerkUser?.publicMetadata?.role ?? sessionClaims?.metadata?.role;
			if (role !== 'admin') {
				return NextResponse.redirect(new URL('/dashboard', req.url));
			}
		} catch {
			// If fetching the user fails, fall back to session claims check
			const role = sessionClaims?.metadata?.role;
			if (role !== 'admin') {
				return NextResponse.redirect(new URL('/dashboard', req.url));
			}
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
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
