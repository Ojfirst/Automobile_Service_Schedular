import { prisma } from '@/prisma.db';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

// GET - Get user's vehicles
export async function GET() {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Find or create user in our database
		let dbUser = await prisma.user.findUnique({
			where: { clerkUserId: user.id },
		});

		if (!dbUser) {
			dbUser = await prisma.user.create({
				data: {
					clerkUserId: user.id,
					email: user.emailAddresses[0].emailAddress,
					name: `${user.firstName}`.trim(),
				},
			});
		}

		const vehicles = await prisma.vehicle.findMany({
			where: { ownerId: dbUser.id },
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(vehicles);
	} catch (error) {
		console.error('Error fetching vehicle:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}

// POST - Add a new vehicle
export const POST = async (req: Request) => {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { make, model, year, vin } = await req.json();
		if (!make || !model || !year) {
			return NextResponse.json(
				{ error: 'Vehicle make, model and year is required' },
				{ status: 400 }
			);
		}

		let dbUser = await prisma.user.findUnique({
			where: { clerkUserId: user.id },
		});

		if (!dbUser) {
			dbUser = await prisma.user.create({
				data: {
					clerkUserId: user.id,
					email: user.emailAddresses[0].emailAddress,
					name: `${user.firstName} ${user.lastName}`.trim(),
				},
			});
		}

		const vinValid = vin && vin.trim() !== '' ? vin : null;

		const yearNumber = Number(year);
		if (Number.isNaN(yearNumber)) {
			return NextResponse.json(
				{ error: 'Year must be a valid number' },
				{ status: 400 }
			);
		}

		const vehicle = await prisma.vehicle.create({
			data: {
				make,
				model,
				year: Math.floor(yearNumber),
				vin: vinValid,
				ownerId: dbUser.id,
				// removed nested owner connect to satisfy prisma types
			},
		});
		return NextResponse.json(vehicle);
	} catch (error) {
		console.error('Error creating vehicle', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
};
