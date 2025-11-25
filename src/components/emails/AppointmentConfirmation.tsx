import * as React from 'react';

interface AppointmentConfirmationEmailProps {
  customerName: string;
  appointmentDate: string;
  serviceName: string;
  vehicleInfo: string;
  duration: number;
  price: number;
  appointmentId: string;
}

export const AppointmentConfirmationEmail: React.FC<AppointmentConfirmationEmailProps> = ({
  customerName,
  appointmentDate,
  serviceName,
  vehicleInfo,
  duration,
  price,
  appointmentId,
}) => (
  <div>
    <h1>AutoCare Scheduler - Appointment Confirmed</h1>
    <p>Hello {customerName},</p>

    <p>Your service appointment has been successfully scheduled. Here are your appointment details:</p>

    <div style={{ background: '#f5f5f5', padding: '20px', margin: '20px 0' }}>
      <h2>Appointment Details</h2>
      <p><strong>Service:</strong> {serviceName}</p>
      <p><strong>Vehicle:</strong> {vehicleInfo}</p>
      <p><strong>Date & Time:</strong> {appointmentDate}</p>
      <p><strong>Duration:</strong> {duration} minutes</p>
      <p><strong>Total Cost:</strong> ${price}</p>
      <p><strong>Appointment ID:</strong> {appointmentId}</p>
    </div>

    <h3>Important Reminders:</h3>
    <ul>
      <li>Please arrive 10-15 minutes before your scheduled appointment</li>
      <li>Bring your vehicle registration and insurance documents</li>
      <li>Contact us at least 24 hours in advance if you need to reschedule</li>
    </ul>

    <p>We look forward to serving you!</p>
    <p><strong>The AutoCare Scheduler Team</strong></p>
  </div>
);

// Server-safe HTML template (returns a string) to be used from API routes
export function appointmentConfirmationTemplate(props: AppointmentConfirmationEmailProps) {
  const { customerName, appointmentDate, serviceName, vehicleInfo, duration, price, appointmentId } = props;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Appointment Confirmation</title>
  </head>
  <body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #111;">
    <div style="max-width:600px;margin:0 auto;padding:20px;">
      <h1>AutoCare Scheduler - Appointment Confirmed</h1>
      <p>Hello ${escapeHtml(customerName)},</p>
      <p>Your service appointment has been successfully scheduled. Here are your appointment details:</p>
      <div style="background:#f5f5f5;padding:20px;margin:20px 0;">
        <h2>Appointment Details</h2>
        <p><strong>Service:</strong> ${escapeHtml(serviceName)}</p>
        <p><strong>Vehicle:</strong> ${escapeHtml(vehicleInfo)}</p>
        <p><strong>Date & Time:</strong> ${escapeHtml(appointmentDate)}</p>
        <p><strong>Duration:</strong> ${escapeHtml(String(duration))} minutes</p>
        <p><strong>Total Cost:</strong> $${escapeHtml(String(price))}</p>
        <p><strong>Appointment ID:</strong> ${escapeHtml(appointmentId)}</p>
      </div>
      <h3>Important Reminders:</h3>
      <ul>
        <li>Please arrive 10-15 minutes before your scheduled appointment</li>
        <li>Bring your vehicle registration and insurance documents</li>
        <li>Contact us at least 24 hours in advance if you need to reschedule</li>
      </ul>
      <p>We look forward to serving you!</p>
      <p><strong>The AutoCare Scheduler Team</strong></p>
    </div>
  </body>
</html>`;
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}