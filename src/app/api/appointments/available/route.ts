import { prisma } from '@/prisma.db';
import { NextResponse } from 'next/server';

// GET - get available time slot for a given date
const GET = async (req: Request) => {
	try {
		const { searchParams } = new URL(req.url);
		const date = searchParams.get('date');
		const serviceId = searchParams.get('serviceId');

		console.log('Available slots request for date:', date);

		if (!date) {
			return NextResponse.json({ error: 'Date is required' }, { status: 400 });
		}

		const selectedDate = new Date(date);
		const dayOfWeek = selectedDate.getDay(); // 0 = sunday, 1 = monday, etc.

		console.log('Day of week:', dayOfWeek);

		// Service center hours: Mon - Friday, 9AM - 5PM
		if (dayOfWeek === 0 || dayOfWeek === 6) {
			console.log('Weekend - no slots available');
			return NextResponse.json({ availableSlots: [] });
		}

		// Get service duration
		let serviceDuration = 60; // 1 hour (Default)
		if (serviceId) {
			const service = await prisma.service.findUnique({
				where: { id: serviceId },
			});

			if (service) {
				serviceDuration = service.duration;
				console.log('⏱️ Service duration:', serviceDuration);
			}
		}

		// Generate time slots (9am - 5pm)
		const startHour = 9;
		const endHour = 17;
		const availableSlots = [];

		// Get existing appointments for the selected date
		const startOfDay = new Date(selectedDate);
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date(selectedDate);
		endOfDay.setHours(23, 59, 59, 999);

		console.log(
			'Looking for appointments between:',
			startOfDay,
			'and',
			endOfDay
		);

		const existingAppointments = await prisma.appointment.findMany({
			where: {
				date: {
					gte: startOfDay,
					lte: endOfDay,
				},
				status: {
					in: ['PENDING', 'CONFIRMED'],
				},
			},
			select: {
				date: true,
			},
		});

		console.log('Found existing appointments:', existingAppointments.length);

		// Convert to Set for faster lookup - use ISO strings for exact comparison
		const bookedSlots = new Set(
			existingAppointments.map((apt) => new Date(apt.date).toISOString())
		);

		console.log('Booked slots:', Array.from(bookedSlots));

		// Generate available slots - SIMPLIFIED APPROACH
		for (let hour = startHour; hour < endHour; hour++) {
			// Generate slots every 30 minutes for better availability
			for (let minute = 0; minute < 60; minute += 30) {
				// Skip if this would go past closing time
				if (hour === endHour - 1 && minute >= 30) {
					continue;
				}

				const slotDateTime = new Date(selectedDate);
				slotDateTime.setHours(hour, minute, 0, 0);

				const timeString = `${hour.toString().padStart(2, '0')}:${minute
					.toString()
					.padStart(2, '0')}`;

				// Only include future time slots and check if not booked
				const now = new Date();
				if (
					slotDateTime > now &&
					!bookedSlots.has(slotDateTime.toISOString())
				) {
					availableSlots.push({
						time: timeString,
						datetime: slotDateTime.toISOString(),
						displayTime: slotDateTime.toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
							hour12: true,
						}),
					});
				}
			}
		}

		console.log('Generated available slots:', availableSlots.length);
		console.log('Available slots:', availableSlots);

		return NextResponse.json({ availableSlots });
	} catch (error) {
		console.error('Error fetching available slots:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
};

export { GET };
