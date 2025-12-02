import { prisma } from '@/prisma.db';
import { NextResponse, NextRequest } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Await params promise
		const { id: appointmentId } = await context.params;

		const { newDate } = await request.json();

		if (!newDate) {
			return NextResponse.json(
				{ error: 'New date is required' },
				{ status: 400 }
			);
		}

		const appointment = await prisma.appointment.findFirst({
			where: {
				id: appointmentId,
				user: {
					clerkUserId: user.id,
				},
			},
			include: { service: true, vehicle: true, user: true },
		});

		if (!appointment) {
			return NextResponse.json(
				{
					error:
						'Appointment not found or you do not have permission to reschedule it',
				},
				{ status: 404 }
			);
		}

		const existingAppointment = await prisma.appointment.findFirst({
			where: {
				date: new Date(newDate),
				status: { in: ['PENDING', 'CONFIRMED'] },
				id: { not: appointmentId },
			},
		});

		if (existingAppointment) {
			return NextResponse.json(
				{
					error:
						'The selected time slot is already booked. Please choose another time.',
				},
				{ status: 400 }
			);
		}

		const updatedAppointment = await prisma.appointment.update({
			where: { id: appointmentId },
			data: { date: new Date(newDate), status: 'PENDING' },
			include: { service: true, vehicle: true },
		});

		return NextResponse.json({
			success: true,
			message: 'Appointment rescheduled successfully',
			appointment: updatedAppointment,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
