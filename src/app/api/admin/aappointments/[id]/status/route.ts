import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma.db';
import { currentUser } from '@clerk/nextjs/server';

const validStatuses = [
	'PENDING',
	'CONFIRMED',
	'IN_PROGRESS',
	'COMPLETED',
	'CANCELLED',
] as const;

const PATCH = async (
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const user = await currentUser();
		const { id } = await params;

		if (!user) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			);
		}

		// Check admin role
		if (user.publicMetadata?.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 403 }
			);
		}

		// Parse request body
		const body = await request.json().catch(() => null);
		if (!body || typeof body.status !== 'string') {
			return NextResponse.json(
				{ error: 'Invalid request body' },
				{ status: 400 }
			);
		}

		const { status } = body;

		// Validate status
		if (!validStatuses.includes(status as (typeof validStatuses)[number])) {
			return NextResponse.json(
				{ error: 'Invalid status value' },
				{ status: 400 }
			);
		}

		// Update appointment
		const updatedAppointment = await prisma.appointment.update({
			where: { id },
			data: { status },
			include: {
				service: true,
				vehicle: true,
				user: true,
			},
		});

		// Log the action
		console.log(`Admin ${user.id} updated appointment ${id} to ${status}`);

		return NextResponse.json({
			success: true,
			data: updatedAppointment,
			message: 'Appointment status updated successfully',
		});
	} catch (error) {
		console.error('Appointment status update error:', error);

		if (error instanceof Error) {
			if (error.message.includes('Record to update not found')) {
				return NextResponse.json(
					{ error: 'Appointment not found' },
					{ status: 404 }
				);
			}
		}

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
};

export { PATCH };
