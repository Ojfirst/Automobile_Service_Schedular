import { prisma } from '@/prisma.db';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

// GET - Get user's vehicles
export async function GET(_req: Request) {
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
			where: { clerkUserId: user.id },
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
				{ error: 'Vehcile make, model and year is require' },
				{ status: 404 }
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

		const vehicle = await prisma.vehicle.create({
			data: {
				make,
				model,
				year: parseInt(year),
				vin,
				clerkUserId: user.id,
				owner: {
					connect: { clerkUserId: user.id },
				},
			},
		});
		return NextResponse.json(vehicle);
	} catch (error) {
		console.error('Erro creating vehicle', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
};
