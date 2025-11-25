import { prisma } from '@/prisma.db';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { newDate } = await request.json();
		const appointmentId = params.id;

		if (!newDate) {
			return NextResponse.json(
				{ error: 'New date is required' },
				{ status: 400 }
			);
		}

		// Find the appointment and verify it belongs to the user
		const appointment = await prisma.appointment.findFirst({
			where: {
				id: appointmentId,
				user: {
					clerkUserId: user.id,
				},
			},
			include: {
				service: true,
				vehicle: true,
				user: true,
			},
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

		// Check if new time slot is available
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

		// Update appointment date
		const updatedAppointment = await prisma.appointment.update({
			where: { id: appointmentId },
			data: {
				date: new Date(newDate),
				status: 'PENDING', // Reset to pending for rescheduled appointments
			},
			include: {
				service: true,
				vehicle: true,
			},
		});

		console.log(
			`✅ Appointment ${appointmentId} rescheduled by user ${user.id}`
		);

		return NextResponse.json({
			success: true,
			message: 'Appointment rescheduled successfully',
			appointment: updatedAppointment,
		});
	} catch (error) {
		console.error('❌ Error rescheduling appointment:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
