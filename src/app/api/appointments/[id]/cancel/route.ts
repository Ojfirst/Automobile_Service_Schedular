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

		const appointmentId = params.id;

		// Find the appointment and verify it belongs to the user
		const appointment = await prisma.appointment.findFirst({
			where: {
				id: appointmentId,
				user: {
					clerkUserId: user.id,
				},
			},
			include: {
				user: true,
			},
		});

		if (!appointment) {
			return NextResponse.json(
				{
					error:
						'Appointment not found or you do not have permission to cancel it',
				},
				{ status: 404 }
			);
		}

		// Check if appointment can be cancelled (at least 2 hours before)
		const now = new Date();
		const appointmentTime = new Date(appointment.date);
		const timeDifference = appointmentTime.getTime() - now.getTime();
		const hoursDifference = timeDifference / (1000 * 60 * 60);

		if (hoursDifference < 2) {
			return NextResponse.json(
				{
					error:
						'Appointments can only be cancelled at least 2 hours in advance',
				},
				{ status: 400 }
			);
		}

		// Update appointment status to CANCELLED
		const updatedAppointment = await prisma.appointment.update({
			where: { id: appointmentId },
			data: { status: 'CANCELLED' },
			include: {
				service: true,
				vehicle: true,
			},
		});

		console.log(`✅ Appointment ${appointmentId} cancelled by user ${user.id}`);

		return NextResponse.json({
			success: true,
			message: 'Appointment cancelled successfully',
			appointment: updatedAppointment,
		});
	} catch (error) {
		console.error('❌ Error cancelling appointment:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
