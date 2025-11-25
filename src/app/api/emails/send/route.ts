import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { appointmentConfirmationTemplate } from '@/components/emails/AppointmentConfirmation';

export async function POST(request: Request) {
	try {
		if (!process.env.RESEND_API_KEY) {
			console.error(
				'Resend API key missing. Set RESEND_API_KEY in environment.'
			);
			return NextResponse.json(
				{ error: 'Email service not configured' },
				{ status: 500 }
			);
		}

		const resend = new Resend(process.env.RESEND_API_KEY);
		const body = await request.json();

		const {
			customerEmail,
			customerName,
			appointmentDate,
			serviceName,
			vehicleInfo,
			duration,
			price,
			appointmentId,
		} = body;

		// Validate required fields
		if (!customerEmail || !customerName || !appointmentDate || !serviceName) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		console.log('📧 Attempting to send email to:', customerEmail);

		try {
			const html = appointmentConfirmationTemplate({
				customerName,
				appointmentDate,
				serviceName,
				vehicleInfo,
				duration,
				price,
				appointmentId,
			});

			const result = await resend.emails.send({
				from:
					process.env.RESEND_FROM_EMAIL ||
					'AutoCare Scheduler <onboarding@resend.dev>',
				to: [customerEmail],
				subject: `Appointment Confirmed: ${serviceName}`,
				html,
			});

			console.log('✅ Email sent successfully:', result);
			return NextResponse.json({
				success: true,
				message: 'Email sent successfully',
				result,
			});
		} catch (sendError) {
			console.error('❌ Resend send error:', sendError);
			return NextResponse.json(
				{ error: 'Failed to send email' },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('❌ Error in send email API:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
