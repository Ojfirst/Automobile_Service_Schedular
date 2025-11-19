import { prisma } from '@/prisma.db';
import { NextResponse } from 'next/server';

// GET - get available time slot for a given date
const GET = async (req: Request) => {
	try {
		const { searchParams } = new URL(req.url);
		const date = searchParams.get('date');
		const serviceId = searchParams.get('serviceId');

		if (!date) {
			return NextResponse.json({ error: 'Date is required' }, { status: 400 });
		}

		const selectedDate = new Date(date);
		const dayOfWeek = selectedDate.getDay(); // 0 = sunday, 1 = monday, etc.

		// Service center hours: Mon -riday, 9AM - 5PM
		if (dayOfWeek === 0 || dayOfWeek === 6) {
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
			}
		}

		// Generate time slots (9am - 5pm, accounting for service duration)
		const startHour = 9;
		const endHour = 17;
		const slotDuration = serviceDuration;
		const availableSlots = [];

		// Get existing appointments for the selected date

		const startOfDay = new Date(selectedDate);
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date(selectedDate);
		endOfDay.setHours(23, 59, 59, 999);

		const existingAppointments = await prisma.appointment.findMany({
			where: {
				date: {
					gte: startOfDay,
					lte: endOfDay,
				},
			},
			select: {
				date: true,
			},
		});

		// Convert to Set for faster lookup
		const bookedSlots = new Set(
			existingAppointments.map((apt) =>
				new Date(apt.date).toTimeString().slice(0, 5)
			)
		);

		// Generate available slots
		for (let hour = startHour; hour < endHour; hour++) {
			for (let minute = 0; minute < 60; minute += slotDuration) {
				if (hour === endHour - 1 && minute + slotDuration > 60) {
					continue; // Skip slots that would go past closing time
				}

				const timeString = `${hour.toString().padStart(2, '0')}:${minute
					.toString()
					.padStart(2, '0')}`;
				const slotDateTime = new Date(selectedDate);
				slotDateTime.setHours(hour, minute, 0, 0);

				// Only include future time slots
				if (slotDateTime > new Date() && !bookedSlots.has(timeString)) {
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
