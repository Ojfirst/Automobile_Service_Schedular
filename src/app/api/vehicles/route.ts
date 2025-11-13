import { prisma } from '../services/route';
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
					name: `${user.firstName} ${user.lastName}`.trim(),
				},
			});
		}

		const vehicles = await prisma.vehicle.findMany({
			where: { ownerId: user.id },
		});

		return NextResponse.json(vehicles);
	} catch (error) {
		console.error('Error fetching vehicles:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}

// POST - Add a new vehicle
export async function POST(request: Request) {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { make, model, year, vin } = await request.json();

		// Validate required fields
		if (!make || !model || !year) {
			return NextResponse.json(
				{ error: 'Make, model, and year are required' },
				{ status: 400 }
			);
		}

		// Create vehicle
		const vehicle = await prisma.vehicle.create({
			data: {
				make,
				model,
				year: parseInt(year),
				vin,
				clerkUserId: user.id,
			},
		});

		return NextResponse.json(vehicle);
	} catch (error) {
		console.error('Error creating vehicle:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
