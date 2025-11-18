import { prisma } from '@/prisma.db';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

const GET = async () => {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Check user inside DB
		const dbUser = await prisma.user.findUnique({
			where: { clerkUserId: user.id },
		});

		if (!dbUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 402 });
		}

		// find appointment
		const appointments = await prisma.appointment.findMany({
			where: { userId: dbUser.id },
			include: {
				service: true,
				vehicle: true,
			},
			orderBy: { date: 'desc' },
		});

		return NextResponse.json(appointments);
	} catch (error) {
		console.error(error, ':Error fetching appointments');

		return NextResponse.json({ error }, { status: 500 });
	}
};

const POST = async (req: Request) => {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized user' }, { status: 401 });
		}
		// Incomin Req
		const { serviceId, vehicleId, date } = await req.json();

		// Validate required fields/ request
		if (!serviceId || !vehicleId || !date) {
			return NextResponse.json(
				{ error: 'All fields are required' },
				{ status: 400 }
			);
		}

		// find user in Db
		const dbUser = await prisma.user.findUnique({
			where: { clerkUserId: user.id },
		});

		if (!dbUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Check if Vehicle is User's
		const isVehicle = await prisma.vehicle.findFirst({
			where: { id: vehicleId, clerkUserId: user.id },
		});

		if (!isVehicle) {
			return NextResponse.json(
				{ error: 'Vehicle not found or does not belong to user' },
				{ status: 400 }
			);
		}

		// Check if service exists
		const isService = await prisma.service.findUnique({
			where: { id: serviceId },
		});

		if (!isService) {
			return NextResponse.json(
				{ error: 'No existing service found' },
				{ status: 400 }
			);
		}

		// Check if time slot is available
		const existingAppointment = await prisma.appointment.findFirst({
			where: {
				date: new Date(date),
				status: { in: ['PENDING', 'CONFIRMED'] },
			},
		});
		if (!existingAppointment) {
			return NextResponse.json(
				{
					error: 'The time slot is already booked. Kindly choose another time',
				},
				{ status: 400 }
			);
		}

		const newAppointment = await prisma.appointment.create({
			data: {
				date: new Date(date),
				status: 'PENDING',
				userId: dbUser.id,
				vehicleId,
				serviceId,
			},
			include: {
				service: true,
				vehicle: true,
			},
		});

		return NextResponse.json(newAppointment);
	} catch (error) {
		console.error('new appointment failed:', error);

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
};

export { GET, POST };
