import { prisma } from '@/prisma.db';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(
	request: Request,
	context: { params?: Promise<{ id: string }> | { id?: string } }
) {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Resolve params if Next passes them as a Promise (dev types)
		const rawParams = context?.params;
		let resolvedParams: { id?: string } | undefined;

		const isThenable = (obj: unknown): obj is Promise<{ id: string }> => {
			return (
				typeof obj === 'object' &&
				obj !== null &&
				'then' in obj &&
				typeof (obj as { then?: unknown }).then === 'function'
			);
		};

		if (rawParams && isThenable(rawParams)) {
			try {
				resolvedParams = await rawParams;
			} catch {
				resolvedParams = undefined;
			}
		} else {
			resolvedParams = rawParams as { id?: string } | undefined;
		}

		// Read appointment id from resolved params, or fall back to parsing the request URL
		const appointmentId =
			resolvedParams?.id ??
			(() => {
				try {
					const url = new URL(request.url);
					const parts = url.pathname.split('/').filter(Boolean);
					const appointmentsIndex = parts.findIndex(
						(p) => p === 'appointments'
					);
					if (
						appointmentsIndex !== -1 &&
						parts.length > appointmentsIndex + 1
					) {
						return parts[appointmentsIndex + 1];
					}
				} catch {
					// ignore and return undefined
				}
				return undefined;
			})();

		if (!appointmentId) {
			return NextResponse.json(
				{ error: 'Missing appointment id in request' },
				{ status: 400 }
			);
		}

		console.log(
			`🗑️ Cancel request appointmentId=${appointmentId}, params=${JSON.stringify(resolvedParams)}, url=${request.url}`
		);

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
		const rawDate = appointment.date; // e.g.,

		if (!rawDate) {
			return NextResponse.json(
				{ error: 'Appointment date is invalid' },
				{ status: 500 }
			);
		}

		const appointmentTime = new Date(rawDate);

		if (isNaN(appointmentTime.getTime())) {
			return NextResponse.json(
				{ error: 'Invalide appointment date format' },
				{ status: 500 }
			);
		}

		const now = new Date();
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
