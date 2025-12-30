import { requireUserApi } from '@/app/_lib/auth/admin-auth';
import { NextResponse } from 'next/server';

export async function GET() {
	const dbUser = await requireUserApi();
	if (!dbUser) return new Response(null, { status: 401 });
	return NextResponse.json({ dbUser });
}
